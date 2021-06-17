export default {
  state: {
    networks: [
      {
        chainId: "0x1",
        name: "ETH",
        code: 1,
      },
      {
        chainId: "0x38",
        name: "BSC",
        code: 56,
      },
      {
        chainId: "0xfa",
        name: "FTM",
        code: 250,
      },
    ],
    activeNetwork: "0x1",
  },
  mutations: {
    setActiveNetwork(state, payload) {
      state.activeNetwork = payload;
    },
  },
  getters: {
    getActiveNetwork: (state) => state.activeNetwork,
    getActiveChain: (state) =>
      state.networks.find((item) => item.chainId === state.activeNetwork),
    getAvailableNetworks: (state) => state.networks,
  },
};
