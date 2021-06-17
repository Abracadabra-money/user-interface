<template>
  <div class="statistic-item">
    <div class="item-main">
      <div class="title">
        <img src="@/assets/images/i-icon.svg" alt="" class="info-icon" />
        <p>Test Info</p>
      </div>

      <p class="percent-text">{{ parameter }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    parameter: {
      default: "0.040 %",
    },
  },
};
</script>

<style lang="scss" scoped>
.statistic-item {
  .item-main {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      display: flex;
      align-items: center;

      .info-icon {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }

      p {
        max-width: 210px;
        text-align: left;
      }
    }

    .percent-text {
      margin-left: auto;
    }
  }
}
</style>
