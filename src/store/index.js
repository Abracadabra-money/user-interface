import Vue from "vue";
import Vuex from "vuex";

import popups from "@/store/modules/popups";
import metamaskProvider from "@/store/modules/metamaskProvider";
import networks from "@/store/modules/networks";
import pools from "@/store/modules/pools";
import tokens from "@/store/modules/tokens";
import swap from "@/store/modules/swap";
import notification from "@/store/modules/notification";
import avaxStatus from "@/store/modules/avaxStatus";
import balances from "@/store/modules/balances";
import collateralParameters from "@/store/modules/collateralParameters";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // showBanner: localStorage.getItem("showBanner") || "show",
  },
  mutations: {
    // closeBanner(state) {
    //   localStorage.setItem("showBanner", "hide");
    //   state.showBanner = "hide";
    // },
  },
  actions: {},
  getters: {
    // getShowBanner: (state) => state.showBanner,
  },
  modules: {
    popups,
    metamaskProvider,
    networks,
    pools,
    tokens,
    swap,
    notification,
    avaxStatus,
    balances,
    collateralParameters,
  },
});
