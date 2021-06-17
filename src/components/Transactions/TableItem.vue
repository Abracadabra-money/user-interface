<template>
  <div class="trans-table-item">
    <div class="table-col">
      <div class="info-row">
        <img src="@/assets/images/pixel-time.svg" alt="" class="icon" />
        <div class="text-wrap">
          <p>12.04.2021</p>
          <p>12.00</p>
        </div>
      </div>
    </div>
    <div class="table-col">
      <div class="info-row">
        <img src="@/assets/images/coin.svg" alt="" class="icon" />
        <div class="text-wrap">
          <p>Borrow</p>
        </div>
      </div>
    </div>
    <div class="table-col">
      <div class="info-row">
        <img src="@/assets/images/pixel-percent.svg" alt="" class="icon" />
        <div class="text-wrap">
          <p>20%</p>
        </div>
      </div>
    </div>
    <div class="table-col">
      <div class="info-row">
        <img src="@/assets/images/pixel-eth.svg" alt="" class="icon" />
        <div class="text-wrap">
          <p>4.000</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    historyItem: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.trans-table-item {
  display: flex;
  align-items: center;
  padding: 13px 30px;
  background-color: $clrBg2;
  border-radius: 12px;
  margin-bottom: 10px;
  min-height: 120px;

  .table-col {
    width: calc(100% / 4);
    text-align: left;
  }

  .icon {
    height: 32px;
    width: auto;
    object-fit: contain;
    margin-right: 10px;
  }

  .info-row {
    display: flex;
    align-items: center;
  }
}

@media screen and(max-width: 640px) {
  .trans-table-item {
    align-items: flex-start;
    padding: 30px 10px;

    .info-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .icon {
      height: 24px;
      margin-bottom: 5px;
    }

    p {
      font-size: 14px;
    }
  }
}
</style>
