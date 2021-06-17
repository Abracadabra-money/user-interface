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

  .arrow-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin-right: 10px;
  }

  p {
    font-size: 16px;
    line-height: 1.23;
    letter-spacing: 0.045em;
    text-transform: uppercase;
  }
}
</style>
