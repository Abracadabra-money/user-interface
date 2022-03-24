<template>
  <div class="back-btn" @click="clickHandler">
    <img src="@/assets/images/back-arrow.svg" alt="" class="arrow-icon" />
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "Back",
    },
  },
  methods: {
    clickHandler() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: max-content;
  background: #353535;
  border-radius: 16px;
  padding: 6px 16px;

  .arrow-icon {
    width: 7px;
    height: 12px;
    object-fit: contain;
    margin-right: 12px;
  }

  p {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
