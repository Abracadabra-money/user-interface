import farmPools from "@/utils/contracts/farmPools.js";
import { tokenPrices, numberWithCommas } from "@/utils/helpers.js";

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
    async createFarmPools() {
      const chainPools = farmPools.filter(
        (pool) => pool.contractChain === this.chainId
      );

      const pools = await Promise.all(
        chainPools.map((pool) => this.createFarmPool(pool))
      );

      console.log("STAND CREATED FARMS POOLS:", pools);

      this.$store.commit("setFarmPools", pools);
    },
    async createFarmPool(farmPoolInfo) {
      const contractInstance = new this.$ethers.Contract(
        farmPoolInfo.contract.address,
        JSON.stringify(farmPoolInfo.contract.abi),
        this.signer
      );

      let poolInfo;

      try {
        poolInfo = await contractInstance.poolInfo(farmPoolInfo.poolId, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("pool infi err:", e);
      }

      const erc20ContractInstance = new this.$ethers.Contract(
        poolInfo.stakingToken,
        JSON.stringify(farmPoolInfo.erc20Abi),
        this.signer
      );

      let tokenContractInstance = new this.$ethers.Contract(
        farmPoolInfo.token.address,
        JSON.stringify(farmPoolInfo.erc20Abi),
        this.signer
      );

      let tokenPrice = await this.getTokenPrice(farmPoolInfo.token.name);

      if (farmPoolInfo.id === 3) {
        tokenPrice = await this.getTokenPrice("Spell");
      }

      console.log("tokenPrice", tokenPrice);

      let { lpYield, lpPrice } = await this.getLPYield(
        poolInfo.stakingToken,
        tokenContractInstance,
        erc20ContractInstance,
        tokenPrice
      );

      console.log("pYield, lpPrice", lpYield, lpPrice, poolInfo.stakingToken);

      let poolYield = await this.getYield(
        contractInstance,
        lpYield,
        poolInfo.stakingTokenTotalAmount,
        poolInfo.allocPoint,
        poolInfo.accIcePerShare
      );

      if (farmPoolInfo.id === 3) {
        const stakingTokenContract = new this.$ethers.Contract(
          poolInfo.stakingToken,
          JSON.stringify(farmPoolInfo.stakingTokenAbi),
          this.signer
        );

        try {
          const price = await stakingTokenContract.get_virtual_price();

          const parsedPrice = this.$ethers.utils.formatEther(price.toString());

          if (parsedPrice) lpPrice = parsedPrice;
        } catch (e) {
          console.log("get price err:", e);
        }

        poolYield = await this.getYield(
          contractInstance,
          1000,
          poolInfo.stakingTokenTotalAmount,
          poolInfo.allocPoint,
          poolInfo.accIcePerShare
        );
      }

      //.. const poolYieldPerDollar = parseFloat(poolYield).toFixed(2);

      let poolRoi = await this.getRoi(poolYield, tokenPrice);

      const poolTvl = await this.getTVL(
        poolInfo.stakingTokenTotalAmount,
        lpPrice
      );

      const allowance = await this.getAllowance(
        erc20ContractInstance,
        farmPoolInfo.contract.address
      );

      return {
        name: farmPoolInfo.name,
        nameSubtitle: farmPoolInfo.nameSubtitle,
        stakingTokenLink: farmPoolInfo.stakingTokenLink,
        id: farmPoolInfo.id,
        poolId: farmPoolInfo.poolId,
        contractInstance,
        stakingTokenName: farmPoolInfo.stakingTokenName,
        stakingTokenType: farmPoolInfo.stakingTokenType,
        lpPrice,
        contractAddress: farmPoolInfo.contract.address,
        poolInfo,
        erc20ContractInstance,
        tokenPrice,
        poolYield,
        poolRoi,
        poolTvl,
        tokenName: farmPoolInfo.token.name,
        allowance,
      };
    },
    async getFarmPoolYield() {
      try {
        const poolYield = (await this.getYield()) / this.icePrice;
        this.yieldPerDollar = parseFloat(poolYield).toFixed(2);
        await this.getRoi(poolYield);
      } catch (e) {
        console.log("getFarmPoolYield err:", e);
      }
    },
    async getYield(
      contractInstance,
      amount = 1000,
      stakingTokenTotalAmount,
      allocPoint,
      accIcePerShare
    ) {
      try {
        const divide =
          BigInt(
            parseInt(
              this.$ethers.utils.formatEther(stakingTokenTotalAmount.toString())
            )
          ) + BigInt(amount);

        const multiplier = BigInt(86400);

        const icePerSecondResp = await contractInstance.icePerSecond();
        const icePerSecond = BigInt(icePerSecondResp.toString());

        const totalAllocPointResp = await contractInstance.totalAllocPoint();
        const totalAllocPoint = BigInt(totalAllocPointResp.toString());

        let iceReward =
          (multiplier * icePerSecond * BigInt(allocPoint)) / totalAllocPoint;

        let loacalAccIcePerShare =
          BigInt(accIcePerShare.toString()) +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide);

        const accIcePerShareConst =
          loacalAccIcePerShare +
          (BigInt(iceReward) * BigInt(Math.pow(10, 12))) / BigInt(divide);

        const rewardDebt =
          (BigInt(amount) * BigInt(loacalAccIcePerShare)) /
          BigInt(Math.pow(10, 12));

        const pending =
          (BigInt(amount) * BigInt(accIcePerShareConst)) /
            BigInt(Math.pow(10, 12)) -
          BigInt(rewardDebt);

        const result = parseFloat(
          this.$ethers.utils.formatUnits(BigInt(pending))
        ).toFixed(2);
        return result;
      } catch (error) {
        console.log("getYield", error);
        return 0;
      }
    },
    async getLPYield(stakingToken, iceInstance, erc20, tokenPrice) {
      try {
        let IceInSlpTotal = BigInt(await iceInstance.balanceOf(stakingToken));

        let totalTokensSLPMinted = BigInt(await erc20.totalSupply());

        let icePerLp;
        if (parseInt(IceInSlpTotal) > 0) {
          icePerLp = parseInt(totalTokensSLPMinted) / parseInt(IceInSlpTotal);
        }
        if (parseInt(IceInSlpTotal) === 0) {
          icePerLp = 0;
        }

        const lpPrice =
          (parseInt(IceInSlpTotal.toString()) /
            parseInt(totalTokensSLPMinted.toString())) *
          tokenPrice *
          2;

        let IcePer1000Bucks;

        if (tokenPrice > 0) IcePer1000Bucks = 1000 / tokenPrice;
        if (tokenPrice === 0) IcePer1000Bucks = 0;

        let res = (IcePer1000Bucks * icePerLp) / 2; // for LP pool

        return { lpYield: parseInt(res), lpPrice };
      } catch (error) {
        console.log(error);
      }
    },
    async getRoi(value, price) {
      try {
        const dollarPerDay =
          ((parseFloat(value) * parseFloat(price) * 100) / 1000) * 365;

        return parseFloat(dollarPerDay).toFixed(2);
      } catch (error) {
        console.log("getRoi", error);
      }
    },
    async getTVL(stakingTokenTotalAmount, price) {
      try {
        const ttl = parseFloat(
          this.$ethers.utils.formatEther(stakingTokenTotalAmount.toString())
        ).toFixed(2);

        const tvl = parseFloat(ttl.toString()) * parseFloat(price.toString());

        return numberWithCommas(parseInt(tvl));
      } catch (error) {
        console.log(error);
      }
    },
    async getAllowance(contractInstance, allowAddrr) {
      try {
        const result = await contractInstance.allowance(
          this.account,
          allowAddrr
        );

        return +result > 0 ? true : false;
      } catch (error) {
        console.log("getAllowance:", error);
      }
    },
    async getTokenPrice(token) {
      if (token === "ICE") {
        const priceResp = await tokenPrices(["ice"]);
        return priceResp.ice;
      }

      if (token === "Spell") {
        const priceResp = await tokenPrices(["spell"]);
        return priceResp.spell;
      }

      if (token === "MIM") {
        return 1;
      }
    },
  },
};
