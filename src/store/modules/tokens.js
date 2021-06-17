import axios from "axios";

export default {
  state: {
    sSpellStakeObject: null,
  },
  mutations: {
    setSSpellObject(state, payload) {
      state.sSpellStakeObject = payload;
    },
  },
  actions: {
    async getTokenPrice(_, { from, to }) {
      try {
        const url = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;
        const response = await axios.get(url);

        return response.data;
      } catch (e) {
        console.log("getTokenPrice err: ", e);
      }
    },
  },
  getters: {
    getSSpellObject: (state) => state.sSpellStakeObject,
  },
};
