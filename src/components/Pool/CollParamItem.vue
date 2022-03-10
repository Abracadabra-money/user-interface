<template>
  <div class="param-item">
    <div class="item-main" @click="toggleInfo">
      <div class="title">
        <img src="@/assets/images/i-icon.svg" alt="" class="info-icon" />
        <p>{{ itemProp.title }}</p>
      </div>

      <p class="percent-text">{{ itemProp.value }}</p>
    </div>
    <transition name="fade">
      <div class="item-info" v-if="showInfo && hasInfo">
        <p>{{ itemProp.additional }}</p>
      </div>
    </transition>
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
  data() {
    return {
      showInfo: false,
    };
  },
  computed: {
    hasInfo() {
      return !!this.item.additional;
    },
    itemProp() {
      return this.item;
    },
  },
  methods: {
    toggleInfo() {
      if (!this.hasInfo) return false;
      this.showInfo = !this.showInfo;
    },
  },
};
</script>

<style lang="scss" scoped>
.param-item {
  .item-main {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

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

  .item-info {
    background: $clrBg1;
    border-radius: 8px;
    padding: 20px;
    text-align: left;
  }
}
</style>
