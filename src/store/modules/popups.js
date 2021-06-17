export default {
  state: {
    showPopup: false,
    popupType: null,
    popupData: null,
  },
  mutations: {
    setPopupState(state, { type, isShow, datas }) {
      state.popupType = type;
      state.showPopup = isShow;
      state.popupData = datas;
    },
    closePopups(state) {
      state.popupType = null;
      state.showPopup = false;
      state.popupData = null;
    },
  },
  getters: {
    getPopupState: (state) => state.showPopup,
    getPopupType: (state) => state.popupType,
    getPopupData: (state) => state.popupData,
  },
};
