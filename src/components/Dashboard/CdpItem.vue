<template>
  <div class="cdp-item">
    <div class="value-type">
      <TokenIcon :token="pool.token.name" />
      <p>{{ pool.name }}</p>
    </div>

    <div class="status-item" v-if="false">
      <p>liquidation...</p>
    </div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/UiComponents/TokenIcon");

export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
  },
  components: {
    TokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.cdp-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  //min-height: 40px;
  margin: 5px 0;

  .value-type {
    display: flex;
    align-items: center;
    justify-content: center;

    .token-icon-wrap {
      width: 24px;
      height: 24px;
    }

    p {
      font-size: 14px;
      line-height: 20px;
    }
  }

  .status-item {
    background: $clrOrange;
    border-radius: 21px;
    height: 24px;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }
}
</style>
