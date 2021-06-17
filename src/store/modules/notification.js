export default {
  state: {
    notification: [],
  },
  mutations: {
    addNotification(state, payload) {
      const notification = {
        ...payload,
        id: state.notification.length + 1,
      };

      state.notification.push(notification);
    },
    deleteNotification(state, id) {
      state.notification = state.notification.filter((item) => item.id !== id);
    },
  },
  actions: {},
  getters: {
    getNotifications: (state) => state.notification,
  },
};
