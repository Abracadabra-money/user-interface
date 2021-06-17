<template>
  <div class="total-item">
    <h2 v-if="type === 'collateral'">Total {{ type.toUpperCase() }}ised</h2>
    <h2 v-if="type === 'borrow'">Total {{ type.toUpperCase() }}ed</h2>
    <div class="img-wrap">
      <img class="type-icon" :src="icon" alt="" />
    </div>
    <p class="count-text">{{ amount }}</p>
    <p class="info-text" v-if="count">{{ type }}ed from {{ count }} pools</p>

    <img
      class="left-bg"
      src="@/assets/images/dashboard/total-left-bg.svg"
      alt=""
    />
    <img
      src="@/assets/images/dashboard/total-right-bg.svg"
      alt=""
      class="right-bg"
    />
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
  background: #221b47;
  border-radius: 20px;
  padding: 20px;
  min-height: 300px;
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
    margin-bottom: 35px;
    text-align: center;
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
    font-size: 40px;
    line-height: 1;
    text-transform: uppercase;
    padding-bottom: 5px;
  }
}
</style>
