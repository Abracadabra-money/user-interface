export default {
  state: {
    balanceNativeToken: {},
    balanceToken: {},
    balancePairToken: {},
  },
  mutations: {
    setBalanceNativeToken(state, payload) {
      // state.balanceNativeToken[payload.id] = payload.balance;
      state.balanceNativeToken = {
        ...state.balanceNativeToken,
        [payload.id]: payload.balance,
      };
    },
    setBalanceToken(state, payload) {
      // state.balanceToken[payload.id] = payload.balance;
      state.balanceToken = {
        ...state.balanceToken,
        [payload.id]: payload.balance,
      };
    },
    setBalancePairToken(state, payload) {
      state.balancePairToken = {
        ...state.balancePairToken,
        [payload.id]: payload.balance,
      };
    },
  },
  actions: {
    async checkBalanceNativeToken({ getters, commit }, id) {
      const balance = await getters.getProvider.getBalance(getters.getAccount);
      commit("setBalanceNativeToken", { balance, id });
    },
    async checkBalanceToken({ getters, commit }, { contract, id }) {
      const balance = await contract.balanceOf(getters.getAccount);
      commit("setBalanceToken", { balance, id });
    },
    async checkBalancePairToken({ getters, commit }, { contract, id }) {
      const balance = await contract.balanceOf(getters.getAccount);
      commit("setBalancePairToken", { balance, id });
    },
  },
  getters: {
    getBalanceNativeToken: (state) => (id) => state.balanceNativeToken[id],
    getBalanceToken: (state) => (id) => state.balanceToken[id],
    getBalancePairToken: (state) => (id) => state.balancePairToken[id],
  },
};
