<template>
  <div class="notification-container">
    <transition-group name="fade">
      <NotificationItem
        v-for="notification in notifications"
        :notification="notification"
        :key="notification.id"
      />
    </transition-group>
  </div>
</template>

<script>
const NotificationItem = () =>
  import("@/components/Notifications/Notification");
export default {
  computed: {
    notifications() {
      return this.$store.getters.getNotifications;
    },
  },
  components: {
    NotificationItem,
  },
};
</script>

<style lang="scss" scoped>
.notification-container {
  position: fixed;
  z-index: 1000;
  top: $headerHeight;
  right: 30px;
  width: 400px;
}
</style>
