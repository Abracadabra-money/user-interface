export default {
  state: {
    useAVAX: false,
  },
  mutations: {
    setUseAVAX(state, payload) {
      state.useAVAX = payload;
    },
  },
  actions: {},
  getters: {
    getUseAVAX: (state) => state.useAVAX,
  },
};
