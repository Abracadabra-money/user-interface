<template>
  <div class="browser-popup">
    <img
      src="@/assets/images/close-popup.svg"
      alt=""
      class="close-btn"
      @click="closePopup"
    />

    <p class="title">
      please change the network <br />
      to use the application
    </p>

    <p class="subtitle">
      Change to<br />
      Avalanche Network
    </p>

    <img src="@/assets/images/browser-warn-logo.svg" alt="" class="main-img" />
  </div>
</template>

<script>
export default {
  methods: {
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.browser-popup {
  padding: 35px 20px;
  padding-bottom: 35px;
  background: $clrBg2;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  width: 95%;
  max-width: 590px;
  position: relative;
  margin-left: auto;
  margin-right: auto;

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    object-fit: contain;
  }

  .title {
    font-size: 24px;
    line-height: 1.7;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 20px;
    line-height: 1.7;
    text-transform: uppercase;
    color: $clrBlue;
  }

  .main-img {
    width: 110px;
    height: auto;
    margin-top: 30px;
  }
}

@media screen and(max-width: 640px) {
  .browser-popup .title {
    font-size: 22px;
  }
}
</style>
