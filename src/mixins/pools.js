import poolsInfo from "@/utils/contracts/pools.js";
import masterContractInfo from "@/utils/contracts/master.js";
import oracleContractsInfo from "@/utils/contracts/oracle.js";
import whitelistContractInfo from "@/utils/contracts/whitelistManager";

export default {
  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    async createContracts() {
      const chainMasterContract = masterContractInfo.find(
        (contract) => contract.contractChain === this.chainId
      );
      if (!chainMasterContract) {
        console.log("No master Contract");
        return false;
      }

      const masterContract = new this.$ethers.Contract(
        chainMasterContract.address,
        JSON.stringify(chainMasterContract.abi),
        this.signer
      );
      await this.createPools(masterContract);
    },

    async createPools(masterContract) {
      const chainPools = poolsInfo.filter(
        (pool) => pool.contractChain === this.chainId
      );
      const pools = await Promise.all(
        chainPools.map((pool) => this.createPool(pool, masterContract))
      );

      console.log("STAND CREATED POOLS:", pools);
      this.$store.commit("setPools", pools);
      const provider = await this.$store.getters.getProvider;
      provider.once("block", () => {
        this.createPools(masterContract);
      });
    },
    createWhitelistManager(address) {
      const whitelistContract = new this.$ethers.Contract(
        address,
        JSON.stringify(whitelistContractInfo.abi),
        this.signer
      );
      return whitelistContract;
    },
    async createPool(pool, masterContract) {
      const poolContract = new this.$ethers.Contract(
        pool.contract.address,
        JSON.stringify(pool.contract.abi),
        this.signer
      );
      pool.isEnabled = true;
      if (pool.name === "WXT") {
        const whitelistContract = this.createWhitelistManager(
          pool.whitelistManager
        );
        pool.isEnabled = (await whitelistContract.info(this.account)).isAllowed;
      }
      const tokenContract = new this.$ethers.Contract(
        pool.token.address,
        JSON.stringify(pool.token.abi),
        this.signer
      );

      const pairTokenContract = new this.$ethers.Contract(
        pool.pairToken.address,
        JSON.stringify(pool.token.abi),
        this.signer
      );

      // const swapContract = new this.$ethers.Contract(
      //   pool.swapContractInfo.address,
      //   JSON.stringify(pool.swapContractInfo.abi),
      //   this.signer
      // );

      const oracleExchangeRate = await this.getOracleExchangeRate(
        pool.token.oracleId,
        pool.token.oracleDatas
      );

      const contractExchangeRate = await this.getContractExchangeRate(
        poolContract
      );

      let tokenPairRate;
      let askUpdatePrice = false;

      if (oracleExchangeRate.toString() < contractExchangeRate.toString()) {
        tokenPairRate = contractExchangeRate;
      } else if (
        oracleExchangeRate.toString() !== contractExchangeRate.toString()
      ) {
        askUpdatePrice = true;
        tokenPairRate = oracleExchangeRate;
      } else {
        tokenPairRate = oracleExchangeRate;
      }

      await this.$store.dispatch("checkTokenPairRateAndPrice", {
        contract: poolContract,
        oracleId: pool.token.oracleId,
        oracleDatas: pool.token.oracleDatas,
        decimals: pool.token.decimals,
        id: pool.id,
      });

      const userBorrowPart = await this.getUserBorrowPart(poolContract);
      const userCollateralShare = await this.getUserCollateralShare(
        poolContract,
        pool.token.decimals
      );

      await this.$store.dispatch("checkUserBorrowPart", {
        contract: poolContract,
        id: pool.id,
      });
      await this.$store.dispatch("checkUserCollateralShare", {
        contract: poolContract,
        decimals: pool.token.decimals,
        id: pool.id,
      });

      let totalCollateralShare;
      try {
        totalCollateralShare = await poolContract.totalCollateralShare();
        await this.$store.dispatch("checkTotalCollateralShare", {
          contract: poolContract,
          id: pool.id,
        });
      } catch (e) {
        console.log("totalCollateralShare Err:", e);
      }

      let totalBorrow;
      try {
        const totalBorrowResp = await poolContract.totalBorrow();
        totalBorrow = totalBorrowResp.base;
        await this.$store.dispatch("checkTotalBorrow", {
          contract: poolContract,
          id: pool.id,
        });
      } catch (e) {
        console.log("totalBorrow Err:", e);
      }

      const dynamicBorrowAmount = await this.getMaxBorrow(
        masterContract,
        pool.contract.address,
        pool.pairToken.address
      );

      let userBalance;
      let userBalanceNativeToken = "";
      try {
        if (pool.name === "AVAX") {
          await this.$store.dispatch("checkBalanceNativeToken", pool.id);
          userBalanceNativeToken =
            await this.$store.getters.getProvider.getBalance(this.account);
        }
        await this.$store.dispatch("checkBalanceToken", {
          contract: tokenContract,
          id: pool.id,
        });
        userBalance = await tokenContract.balanceOf(this.account, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("userBalance Err:", e);
      }

      let userPairBalance;
      try {
        await this.$store.dispatch("checkBalancePairToken", {
          contract: pairTokenContract,
          id: pool.id,
        });
        userPairBalance = await pairTokenContract.balanceOf(this.account, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("userBalance Err:", e);
      }

      const borrowFee =
        (await poolContract.BORROW_OPENING_FEE()).toNumber() / 1000;
      this.$store.commit("setBorrowFee", { fee: borrowFee, id: pool.id });

      const mainInfo = this.getMainInfo(
        pool.ltv,
        pool.stabilityFee,
        pool.interest,
        borrowFee
      );

      const tokenPairPrice = 1;

      const tokenPrice = Number(
        this.$ethers.utils.formatUnits(tokenPairRate, pool.token.decimals)
      );

      this.$store.commit("setPoolLtv", { ltv: pool.ltv, id: pool.id });

      await this.$store.dispatch("createCollateralInfo", pool.id);

      const collateralInfo = this.createCollateralInfo(
        userCollateralShare,
        userBorrowPart,
        tokenPrice,
        pool.ltv
      );

      return {
        name: pool.name,
        id: pool.id,
        isEnabled: pool.isEnabled,
        userBorrowPart,
        userCollateralShare,
        contractInstance: poolContract,
        masterContractInstance: masterContract,
        totalCollateralShare,
        totalBorrow,
        stabilityFee: pool.stabilityFee,
        interest: pool.interest,
        userBalance,
        userBalanceNativeToken,
        userPairBalance,
        ltv: pool.ltv,
        askUpdatePrice,
        initialMax: pool.initialMax,
        pairToken: pool.pairToken,
        pairTokenContract,
        tokenPairPrice,
        tokenPrice,
        dynamicBorrowAmount,
        mainInfo,
        collateralInfo,
        token: {
          contract: tokenContract,
          name: pool.token.name,
          address: pool.token.address,
          decimals: pool.token.decimals,
          oracleId: pool.token.oracleId,
          oracleDatas: pool.token.oracleDatas,
          oracleExchangeRate: tokenPairRate,
        },
        // swapContract: swapContract,
      };
    },
    async getContractExchangeRate(contract) {
      try {
        const rate = await contract.exchangeRate({
          gasLimit: 300000,
        });

        return rate;
      } catch (e) {
        console.log("getContractExchangeRate err:", e);
      }
    },
    async getUserBorrowPart(poolContract) {
      try {
        const userBorrowPart = await poolContract.userBorrowPart(this.account);

        const parsedBorrowed = this.$ethers.utils.formatUnits(
          userBorrowPart.toString()
        );
        return parsedBorrowed;
      } catch (e) {
        console.log("getuserBorrowPartNonce err:", e);
      }
    },
    async getUserCollateralShare(poolContract, decimals) {
      try {
        const userCollateralShare = await poolContract.userCollateralShare(
          this.account
        );

        const parsedCollateral = this.$ethers.utils.formatUnits(
          userCollateralShare.toString(),
          decimals
        );

        return parsedCollateral;
      } catch (e) {
        console.log("getUserCollateralShare err:", e);
      }
    },
    async getMaxBorrow(bentoContract, poolAddr, tokenAddr) {
      try {
        const poolBalance = await bentoContract.balanceOf(tokenAddr, poolAddr, {
          gasLimit: 1000000,
        });

        const toAmount = await bentoContract.toAmount(
          tokenAddr,
          poolBalance,
          false
        );

        const parsedAmount = this.$ethers.utils.formatUnits(toAmount, 18);
        return parsedAmount;
      } catch (e) {
        console.log("getMaxBorrow err:", e);
        return false;
      }
    },
    async getOracleExchangeRate(oracleId, { multiply, divide, decimals }) {
      const oracleContractInfo = oracleContractsInfo.find(
        (item) => item.id === oracleId
      );

      const oracleContract = new this.$ethers.Contract(
        oracleContractInfo.address,
        JSON.stringify(oracleContractInfo.abi),
        this.signer
      );

      try {
        const parsedDecimals = this.$ethers.BigNumber.from(
          Math.pow(10, decimals).toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        let reqObj;

        if (oracleId) {
          reqObj = [multiply, divide, parsedDecimals];
        }
        // const bytesData = await oracleContract.getDataParameter(...reqObj, {
        //   gasLimit: 300000,
        // });
        const bytesData = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "uint256"],
          [...reqObj]
        );

        const rate = await oracleContract.peekSpot(bytesData, {
          gasLimit: 300000,
        });

        return rate;
      } catch (e) {
        console.log("getOracleExchangeRate err:", e);
      }
    },
    getMainInfo(ltv, stabilityFee, interest, borrowFee) {
      return [
        {
          title: "Maximum collateral ratio",
          value: `${ltv} %`,
          tooltip:
            "Maximum collateral ratio (MCR) - MCR represents the maximum amount of debt a user can borrow with a selected collateral token. So as not to be liquidated.",
          additional: `Maximum collateral ratio (MCR) - MCR represents the maximum amount of debt a user can borrow with a selected collateral token. So as not to be liquidated.`,
        },
        {
          title: "Liquidation fee",
          value: `${stabilityFee} %`,
          tooltip:
            "This is the discount a liquidator gets when buying collateral flagged for liquidation.",
          additional:
            "This is the discount a liquidator gets when buying collateral flagged for liquidation.",
        },
        {
          title: "Borrow fee",
          value: `${borrowFee} %`,
          tooltip:
            "This fee is added to your debt every time you borrow NXUSD.",
          additional:
            "This fee is added to your debt every time you borrow NXUSD.",
        },
      ];
    },
    createCollateralInfo(userCollateralShare, userBorrowPart, tokenPrice, ltv) {
      const tokenInUsd = userCollateralShare / tokenPrice;

      const maxNUSDBorrow = (tokenInUsd / 100) * (ltv - 1);

      const borrowLeft = parseFloat(maxNUSDBorrow - userBorrowPart).toFixed(20);
      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
      );
      const borrowLeftParsed = borrowLeft.toString().match(re)[0];
      const collateralDeposited = userCollateralShare.toString().match(re)[0];

      const liquidationPrice =
        userBorrowPart / ((userCollateralShare * ltv) / 100) || 0;

      return [
        {
          title: "Collateral deposited",
          value: collateralDeposited,
          additional: "",
        },
        {
          title: "Collateral value",
          value: `$${parseFloat(tokenInUsd).toFixed(4)}`,
          additional: "",
        },
        {
          title: "NXUSD borrowed",
          value: `$${parseFloat(userBorrowPart).toFixed(4)}`,
          additional: "",
        },
        {
          title: "Liquidation price",
          value: `$${parseFloat(liquidationPrice.toString()).toFixed(4)}`,
          additional: "",
        },
        {
          title: "NXUSD left to borrow",
          value: `${borrowLeftParsed}`,
          additional: "",
        },
      ];
    },
  },
};
