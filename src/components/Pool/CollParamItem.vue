<template>
  <div class="param-item">
    <div class="item-main">
      <div class="title">
        <img src="@/assets/images/i-icon.svg" alt="" class="info-icon" v-tooltip="itemProp.tooltip" />
        <p>{{ itemProp.title }}</p>
      </div>

      <p class="percent-text">{{ itemProp.value }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    itemProp() {
      return this.item;
    },
  },
};
</script>

<style lang="scss" scoped>
.param-item {
  .item-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 16px;

    .title {
      display: flex;
      align-items: center;

      .info-icon {
        width: 13px;
        height: 13px;
        margin-right: 10px;
      }

      p {
        max-width: 210px;
        text-align: left;
      }
    }

    .percent-text {
      font-weight: 700;
      margin-left: auto;
    }
  }

  .item-info {
    background: $clrBg1;
    border-radius: 8px;
    padding: 20px;
    text-align: left;
  }
}
</style>
