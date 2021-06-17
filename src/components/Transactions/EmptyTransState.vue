<template>
  <div class="empty-transactions">
    <p class="title">NO Transactions</p>
    <p class="subtitle">
      Your transactions will be <br />
      displayed here
    </p>

    <img class="main-img" src="@/assets/images/open-chest.svg" alt="" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.empty-transactions {
  background: $clrBg2;
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
</style>
