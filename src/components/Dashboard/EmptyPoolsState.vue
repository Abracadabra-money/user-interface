<template>
  <div class="empty-borrow">
    <p class="title">No {{ blockType }}</p>
    <p class="subtitle">
      Your {{ blockType }} will be displayed here
    </p>
  </div>
</template>

<script>
export default {
  props: {
    blockType: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-borrow {
  padding: 16px 0px;

  .title {
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 14px;
    line-height: 20px;
  }
}

@media screen and(max-width: 860px) {
  .empty-borrow {
    padding-left: 10px;
    padding-right: 10px;
  }

  .empty-borrow .main-img {
    margin-left: 0;
    width: 95%;
    max-width: 400px;
  }
}
</style>
