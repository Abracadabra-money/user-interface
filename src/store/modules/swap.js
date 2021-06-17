export default {
  state: {
    swapObject: null,
  },
  mutations: {
    setSwapObject(state, payload) {
      state.swapObject = payload;
    },
  },
  getters: {
    getSwapObject: (state) => state.swapObject,
  },
};
