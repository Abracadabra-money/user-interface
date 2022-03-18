<template>
  <div class="total-item">
    <h2 v-if="type === 'collateral'">Total {{ type }}ised</h2>
    <h2 v-if="type === 'borrow'">Total {{ type }}ed</h2>
<!--    <div class="img-wrap">-->
<!--      <img class="type-icon" :src="icon" alt="" />-->
<!--    </div>-->
    <p class="count-text">{{ amount }}</p>
    <p class="info-text" v-if="count">{{ type }}ed from {{ count }} pools</p>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      require: true,
    },
    icon: {
      require: true,
    },
    amount: {
      default: 0,
    },
    count: {
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.total-item {
  background: $clrBg1;
  border-radius: 4px;
  padding: 24px;
  min-height: 252px;
  position: relative;

  .left-bg {
    width: 58px;
    height: auto;
    position: absolute;
    bottom: 0;
    left: 14px;
  }

  .right-bg {
    width: 88px;
    height: auto;
    position: absolute;
    bottom: 0;
    right: 4px;
  }

  h2 {
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 40px;
    text-align: left;
  }

  .img-wrap {
    height: 60px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .type-icon {
    width: 32px;
    height: auto;
    object-fit: contain;
  }

  .count-text {
    text-align: left;
    font-size: 32px;
    line-height: 36px;
    text-transform: uppercase;
    padding-bottom: 8px;
  }
  .info-text {
    font-size: 16px;
    line-height: 24px;
    text-align: left;
    color: #8A8A8A;
  }
}
</style>
