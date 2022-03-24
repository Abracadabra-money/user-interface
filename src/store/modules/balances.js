export default {
  state: {
    balanceNativeToken: "",
    balanceToken: "0",
    balancePairToken: "0",
  },
  mutations: {
    setBalanceNativeToken(state, payload) {
      state.balanceNativeToken = payload;
    },
    setBalanceToken(state, payload) {
      state.balanceToken = payload;
    },
    setBalancePairToken(state, payload) {
      state.balancePairToken = payload;
    },
  },
  actions: {
    async checkBalanceNativeToken({ getters, commit }) {
      const balance = await getters.getProvider.getBalance(getters.getAccount);
      commit("setBalanceNativeToken", balance);
    },
    async checkBalanceToken({ getters, commit }, contract) {
      const balance = await contract.balanceOf(getters.getAccount);
      commit("setBalanceToken", balance);
    },
    async checkBalancePairToken({ getters, commit }, contract) {
      const balance = await contract.balanceOf(getters.getAccount);
      commit("setBalancePairToken", balance);
    },
  },
  getters: {
    getBalanceNativeToken: (state) => state.balanceNativeToken,
    getBalanceToken: (state) => state.balanceToken,
    getBalancePairToken: (state) => state.balancePairToken,
  },
};
