<template>
  <div class="deposit-popup">
    <img
      src="@/assets/images/close-popup.svg"
      alt=""
      class="close-btn"
      @click="closePopup"
    />

    <p class="title">Deposit</p>

    <p class="balance-text">Balance: 90 000</p>

    <div class="input-wrap">
      <ValueInput></ValueInput>
    </div>
    <div class="input-wrap">
      <ValueInput></ValueInput>
    </div>
    <div class="input-wrap">
      <ValueInput></ValueInput>
    </div>

    <button class="btn">Deposit</button>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UiComponents/ValueInput");
export default {
  methods: {
    closePopup() {
      this.$emit("close");
    },
  },
  components: {
    ValueInput,
  },
};
</script>

<style lang="scss" scoped>
.deposit-popup {
  padding: 20px;
  padding-bottom: 35px;
  background: $clrBg2;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  width: 95%;
  max-width: 590px;
  position: relative;
  margin-left: auto;
  margin-right: auto;

  .input-wrap {
    margin-bottom: 20px;
  }

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
    margin-bottom: 45px;
  }

  .balance-text {
    text-align: right;
    margin-bottom: 15px;
  }

  .btn {
    margin-top: 20px;
    margin-left: auto;
  }
}
</style>
