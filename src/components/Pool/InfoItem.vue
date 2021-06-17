<template>
  <div class="info-item">
    <div class="content-wrap">
      <p class="title">Repay USDP & Withdraw collateral</p>
      <p>CDP hasn't been opened yet. How to...</p>
    </div>
    <img class="info-arrow" src="@/assets/images/arrow-info.svg" alt="" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.info-item {
  margin: 10px 0;
  border-bottom: 1px solid #4f4583;
  display: flex;
  align-items: center;

  .info-arrow {
    width: 16px;
    height: 16px;
    object-fit: contain;
    cursor: pointer;
  }

  .content-wrap {
    width: calc(100% - 16px);
    padding-right: 30px;
    text-align: left;
    padding-bottom: 13px;
  }

  p {
    font-size: 14px;

    &.title {
      text-transform: uppercase;
      font-size: 16px;
      min-height: 32px;
      margin-bottom: 5px;
    }
  }
}
</style>
