<template>
  <div class="slipage-block">
    <p class="slipage-title">Choose your slipage</p>

    <div class="items-wrap">
      <div
        class="splipage-item"
        :class="{ active: slipage === item }"
        v-for="(item, idx) in slipageItems"
        :key="idx"
        @click="setSlipage(item)"
      >
        <p>{{ item }}%</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slipage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      slipageItems: [0.5, 1, 3],
    };
  },
  methods: {
    setSlipage(item) {
      this.$emit("update", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.slipage-block {
  margin-bottom: 20px;
  margin-top: 20px;

  .slipage-title {
    text-align: left;
  }

  .items-wrap {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }

  .splipage-item {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.06);
    padding: 6px 14px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 10px;
    font-size: 14px;
    line-height: 20px;

    &:hover,
    &.active {
      background: #E7FC6E;
      color: #1C1C1C;
    }
  }
}
</style>
