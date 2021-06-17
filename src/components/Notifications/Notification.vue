<template>
  <div class="notification-item">
    <img
      src="@/assets/images/close-popup.svg"
      alt=""
      class="hide-notify"
      @click="closeNotification"
    />

    <img
      src="@/assets/images/notification-dragon.png"
      alt=""
      class="main-img"
    />

    <div class="content-wrap">
      <p>{{ notification.msg }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeNotification() {
      this.$store.commit("deleteNotification", this.notification.id);
    },
  },
  mounted() {
    setTimeout(() => {
      this.closeNotification();
    }, 10000);
  },
};
</script>

<style lang="scss" scoped>
.notification-item {
  width: 400px;
  background: $clrBg2;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 25px 20px;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .hide-notify {
    width: 20px;
    height: 20px;
    object-fit: contain;
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .content-wrap {
    padding-left: 10px;
    text-align: left;
  }

  .main-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
