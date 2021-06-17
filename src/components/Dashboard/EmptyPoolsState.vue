<template>
  <div class="empty-borrow">
    <p class="title">No {{ blockType }}</p>
    <p class="subtitle">
      Your {{ blockType }} will be <br />
      displayed here
    </p>

    <img class="main-img" src="@/assets/images/open-chest.svg" alt="" />
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
  border-radius: 20px;
  padding: 80px;

  .title {
    font-size: 24px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 18px;
  }

  .main-img {
    width: 400px;
    height: auto;
    object-fit: contain;
    margin-top: 40px;
    margin-left: 160px;
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
