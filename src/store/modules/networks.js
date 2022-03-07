export default {
  state: {
    networks: [
      // {
      //   chainId: "0x1",
      //   name: "ETH",
      //   code: 1,
      // },
      // {
      //   chainId: "0x38",
      //   name: "BSC",
      //   code: 56,
      // },
      // {
      //   chainId: "0xfa",
      //   name: "FTM",
      //   code: 250,
      // },
      {
        chainId: "0xa86a",
        name: "AVAX",
        code: 43114,
      },
      {
        chainId: "0xa869",
        name: "AVAX Fuji",
        code: 43113,
      },
      // {
      //   chainId: "0x539",
      //   name: "AVAX local",
      //   code: 1337,
      // },
    ],
    activeNetwork: "0xa86a",
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
