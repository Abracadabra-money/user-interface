<template>
  <div class="trans-table-head">
    <div class="table-col">
      <p>Date</p>
    </div>
    <div class="table-col">
      <p>Action</p>
    </div>
    <div class="table-col">
      <p>%</p>
    </div>
    <div class="table-col">
      <p>Amount</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.trans-table-head {
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background-color: $clrBg2;
  border-radius: 12px;
  margin-bottom: 10px;
  min-height: 60px;

  .table-col {
    width: calc(100% / 4);
    text-align: left;

    p {
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.065em;
    }
  }
}

@media screen and(max-width: 640px) {
  .trans-table-head {
    padding-left: 10px;
    padding-right: 10px;

    .table-col {
      p {
        font-size: 10px;
      }
    }
  }
}
</style>
