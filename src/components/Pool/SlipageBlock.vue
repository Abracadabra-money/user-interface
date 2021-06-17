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
    border: 1px solid transparent;
    padding: 3px 7px;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 10px;

    &:hover,
    &.active {
      border: 1px solid $clrBlue;
    }
  }
}
</style>
