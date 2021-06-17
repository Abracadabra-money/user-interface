<template>
  <div class="trans-success-popup">
    <img
      src="@/assets/images/close-popup.svg"
      alt=""
      class="close-btn"
      @click="closePopup"
    />

    <p class="title">
      Transactions <br />
      submitted
    </p>

    <a href="#" class="link">View on explorer</a>

    <img src="@/assets/images/closed-chest.svg" alt="" class="chest-img" />

    <img src="@/assets/images/dragon-coins.svg" alt="" class="dragon-bg" />
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
.trans-success-popup {
  padding: 20px;
  padding-bottom: 155px;
  background: $clrBg2;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  width: 95%;
  max-width: 590px;
  position: relative;
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;

  .chest-img {
    margin-top: 20px;
    width: 180px;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .dragon-bg {
    position: absolute;
    bottom: -25px;
    left: -20px;
    width: calc(100% + 40px);
    object-fit: cover;
    z-index: 1;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    object-fit: contain;
    z-index: 3;
  }

  .title {
    font-size: 24px;
    line-height: 1.7;
    text-transform: uppercase;
    margin-bottom: 25px;
    position: relative;
    z-index: 2;
  }

  .link {
    line-height: 1.7;
    text-align: center;
    text-transform: uppercase;
    text-decoration: none;
    color: $clrBlue;
    position: relative;
    z-index: 2;

    &:hover {
      color: $clrNavHover;
    }
  }
}
</style>
