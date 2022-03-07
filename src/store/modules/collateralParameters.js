import { ethers } from "ethers";
export default {
  state: {
    collateralShare: 0,
    borrowPart: 0,
    ltv: 0,
    tokenPrice: 0,
    collateralInfo: [],
  },
  mutations: {
    setUserCollateralShare(state, payload) {
      state.collateralShare = payload;
    },

    setPoolLtv(state, payload) {
      state.ltv = payload;
    },

    setTokenPrice(state, payload) {
      state.tokenPrice = payload;
    },

    setCollateralInfo(state, payload) {
      state.collateralInfo = payload;
    },

    setUserBorrowPart(state, payload) {
      state.borrowPart = payload;
    },
  },
  actions: {
    async setUserCollateralShare({ getters, commit }, contract, decimals) {
      try {
        const userCollateralShare = await contract.userCollateralShare(
          getters.getAccount
        );

        const parsedCollateral = ethers.utils.formatUnits(
          userCollateralShare.toString(),
          decimals
        );

        commit("setUserCollateralShare", parsedCollateral);
      } catch (e) {
        console.log("setUserCollateralShare err:", e);
      }
    },

    async setUserBorrowPart({ getters, commit }, contract) {
      try {
        const userBorrowPart = await contract.userBorrowPart(
          getters.getAccount
        );

        const parsedBorrowed = ethers.utils.formatUnits(
          userBorrowPart.toString()
        );

        commit("setUserBorrowPart", parsedBorrowed);
      } catch (e) {
        console.log("setUserBorrowPartNonce err:", e);
      }
    },

    createCollateralInfo({ commit, getters }) {
      const userCollateralShare = getters.getUserCollateralShare;
      const tokenPrice = getters.getTokenPrice;
      const userBorrowPart = getters.getUserBorrowPart;
      const ltv = getters.getPoolLtv;

      const tokenInUsd = userCollateralShare / tokenPrice;

      const maxNUSDBorrow = (tokenInUsd / 100) * (ltv - 1);

      const borrowLeft = parseFloat(maxNUSDBorrow - userBorrowPart).toFixed(20);
      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
      );
      const borrowLeftParsed = borrowLeft.toString().match(re)[0];
      const collateralDeposited = userCollateralShare.toString().match(re)[0];

      const liquidationMultiplier = (200 - ltv) / 100;

      const liquidationPrice =
        ((userBorrowPart * tokenPrice) / userCollateralShare) *
          (1 / tokenPrice) *
          liquidationMultiplier || 0;

      const collateralInfo = [
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
          title: "NUSD borrowed",
          value: `$${parseFloat(userBorrowPart).toFixed(4)}`,
          additional: "",
        },
        {
          title: "Liquidation price",
          value: `$${parseFloat(liquidationPrice).toFixed(4)}`,
          additional: "",
        },
        {
          title: "NUSD left to borrow",
          value: `${borrowLeftParsed}`,
          additional: "",
        },
      ];

      commit("setCollateralInfo", collateralInfo);
    },
  },
  getters: {
    getUserCollateralShare: (state) => state.collateralShare,
    getUserBorrowPart: (state) => state.borrowPart,
    getPoolLtv: (state) => state.ltv,
    getTokenPrice: (state) => state.tokenPrice,
    getCollateralInfo: (state) => state.collateralInfo,
  },
};
