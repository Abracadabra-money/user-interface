export default {
  state: {
    pools: [],
    farmPools: [],
    mim3Pool: null,
  },
  mutations: {
    setPools(state, payload) {
      state.pools = payload;
    },
    setFarmPools(state, payload) {
      state.farmPools = payload;
    },
    setMim3Pool(state, payload) {
      state.mim3Pool = payload;
    },
  },
  getters: {
    getPools: (state) => state.pools,
    getPoolById: (state) => (id) => {
      return state.pools.find((pool) => pool.id === id);
    },
    getFarmPools: (state) => state.farmPools,
    getFarmPoolById: (state) => (id) => {
      return state.farmPools.find((pool) => pool.id === id);
    },
    getMim3Pools: (state) => state.mim3Pool,
  },
};
