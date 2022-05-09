import { ethers } from "ethers";
import oracleContractsInfo from "@/utils/contracts/oracle";
export default {
  state: {
    userCollateralShare: {},
    userBorrowPart: {},
    totalCollateralShare: {},
    totalBorrow: {},
    ltv: {},
    tokenPrice: {},
    tokenPairRate: {},
    askUpdatePrice: {},
    borrowFee: {},
    collateralInfo: {},
  },
  mutations: {
    setAskUpdatePrice(state, payload) {
      state.askUpdatePrice = {
        ...state.askUpdatePrice,
        [payload.id]: payload.askUpdatePrice,
      };
    },

    setTokenPairRate(state, payload) {
      state.tokenPairRate = {
        ...state.tokenPairRate,
        [payload.id]: payload.tokenPairRate,
      };
    },

    setBorrowFee(state, payload) {
      state.borrowFee = {
        ...state.borrowFee,
        [payload.id]: payload.fee,
      };
    },

    setUserCollateralShare(state, payload) {
      state.userCollateralShare = {
        ...state.userCollateralShare,
        [payload.id]: payload.userCollateralShare,
      };
    },

    setTotalCollateralShare(state, payload) {
      state.totalCollateralShare = {
        ...state.totalCollateralShare,
        [payload.id]: payload.totalCollateralShare,
      };
    },

    setUserBorrowPart(state, payload) {
      state.userBorrowPart = {
        ...state.userBorrowPart,
        [payload.id]: payload.userBorrowPart,
      };
    },

    setTotalBorrow(state, payload) {
      state.totalBorrow = {
        ...state.totalBorrow,
        [payload.id]: payload.totalBorrow,
      };
    },

    setPoolLtv(state, payload) {
      state.ltv = {
        ...state.ltv,
        [payload.id]: payload.ltv,
      };
    },

    setTokenPrice(state, payload) {
      state.tokenPrice = {
        ...state.tokenPrice,
        [payload.id]: payload.tokenPrice,
      };
    },

    setCollateralInfo(state, payload) {
      state.collateralInfo = {
        ...state.collateralInfo,
        [payload.id]: payload.collateralInfo,
      };
    },
  },
  actions: {
    async checkTokenPairRateAndPrice(
      { commit, dispatch },
      { contract, oracleId, oracleDatas, decimals, id }
    ) {
      const oracleExchangeRate = await dispatch("getOracleExchangeRate", {
        oracleId,
        oracleDatas,
      });

      const contractExchangeRate = await dispatch(
        "getContractExchangeRate",
        contract
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

      const tokenPrice = Number(
        ethers.utils.formatUnits(tokenPairRate, decimals)
      );

      commit("setTokenPrice", { tokenPrice, id });
      commit("setTokenPairRate", { tokenPairRate, id });
      commit("setAskUpdatePrice", { askUpdatePrice, id });
    },

    async getOracleExchangeRate({ getters }, { oracleId, oracleDatas }) {
      const oracleContractInfo = oracleContractsInfo.find(
        (item) => item.id === oracleId
      );

      const oracleContract = new ethers.Contract(
        oracleContractInfo.address,
        JSON.stringify(oracleContractInfo.abi),
        getters.getSigner
      );

      try {
        const parsedDecimals = ethers.BigNumber.from(
          Math.pow(10, oracleDatas.decimals).toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        let reqObj;

        if (oracleId) {
          reqObj = [oracleDatas.multiply, oracleDatas.divide, parsedDecimals];
        }

        const bytesData = ethers.utils.defaultAbiCoder.encode(
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

    async getContractExchangeRate(context, contract) {
      try {
        const rate = await contract.exchangeRate({
          gasLimit: 300000,
        });

        return rate;
      } catch (e) {
        console.log("getContractExchangeRate err:", e);
      }
    },

    async checkTotalBorrow({ commit }, { contract, id }) {
      const totalBorrowResp = await contract.totalBorrow();
      commit("setTotalBorrow", { totalBorrow: totalBorrowResp.base, id });
    },

    async checkTotalCollateralShare({ commit }, { contract, id }) {
      const totalCollateralShare = await contract.totalCollateralShare();
      commit("setTotalCollateralShare", { totalCollateralShare, id });
    },

    async checkUserCollateralShare(
      { getters, commit },
      { contract, decimals, id }
    ) {
      try {
        const userCollateralShare = await contract.userCollateralShare(
          getters.getAccount
        );

        const parsedCollateral = ethers.utils.formatUnits(
          userCollateralShare.toString(),
          decimals
        );

        commit("setUserCollateralShare", {
          userCollateralShare: parsedCollateral,
          id,
        });
      } catch (e) {
        console.log("checkUserCollateralShare err:", e);
      }
    },

    async checkUserBorrowPart({ getters, commit }, { contract, id }) {
      try {
        const userBorrowPart = await contract.userBorrowPart(
          getters.getAccount
        );

        const parsedBorrowed = ethers.utils.formatUnits(
          userBorrowPart.toString()
        );

        commit("setUserBorrowPart", { userBorrowPart: parsedBorrowed, id });
      } catch (e) {
        console.log("setUserBorrowPartNonce err:", e);
      }
    },

    createCollateralInfo({ commit, getters }, id) {
      const userCollateralShare = getters.getUserCollateralShare(id);
      const userBorrowPart = getters.getUserBorrowPart(id);
      const tokenPrice = getters.getTokenPrice(id);
      const ltv = getters.getPoolLtv(id);

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

      const collateralInfo = [
        {
          title: "Collateral deposited",
          value: collateralDeposited,
          tooltip: "Amount of Tokens Deposited as Collaterals",
          additional: "",
        },
        {
          title: "Collateral value",
          value: `$ ${parseFloat(tokenInUsd).toFixed(4)}`,
          tooltip: "USD Value of the Collateral Deposited in your Position",
          additional: "",
        },
        {
          title: "NXUSD borrowed",
          value: `$ ${parseFloat(userBorrowPart).toFixed(4)}`,
          tooltip: "NXUSD Currently Borrowed in your Position",
          additional: "",
        },
        {
          title: "Liquidation price",
          value: `$ ${parseFloat(liquidationPrice).toFixed(6)}`,
          tooltip: "Collateral Price at which your Position will be Liquidated",
          additional: "",
        },
        {
          title: "NXUSD left to borrow",
          value: `${borrowLeftParsed}`,
          tooltip: "NXUSD Borrowable Given the Collateral Deposited",
          additional: "",
        },
      ];

      commit("setCollateralInfo", { collateralInfo, id });
    },
  },
  getters: {
    getUserCollateralShare: (state) => (id) => state.userCollateralShare[id],
    getTotalCollateralShare: (state) => (id) => state.totalCollateralShare[id],
    getUserBorrowPart: (state) => (id) => state.userBorrowPart[id],
    getTotalBorrow: (state) => (id) => state.totalBorrow[id],
    getPoolLtv: (state) => (id) => state.ltv[id],
    getTokenPrice: (state) => (id) => state.tokenPrice[id],
    getCollateralInfo: (state) => (id) => state.collateralInfo[id],
    getBorrowFee: (state) => (id) => state.borrowFee[id],
  },
};
