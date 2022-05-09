<template>
  <div class="estimation-block">
    <div class="item-main">
      <p>NXUSD Amount</p>
      <p class="percent-text"><span>~$ </span>{{ this.nxusdAmountDisplay }}</p>
    </div>

    <div class="item-main">
      <p>Expected Liquidation Price</p>
      <p class="percent-text" v-if="value">
        <span>~$ </span>{{ liquidityPriceFormatted }}
      </p>
      <p class="percent-text" v-if="!value">
        <span>~$ </span>{{ liquidityPriceFormatted }}
      </p>
    </div>

    <div class="item-main">
      <p>Position Health</p>
      <p class="position-health-text">~ {{ liquidationRisk }} %</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //inputStatus: true,
    };
  },
  props: {
    liquidityPrice: {
      required: true,
    },
    reset: {
      type: Boolean,
    },
    nxusdAmount: {
      required: true,
    },
    maxValue: {
      type: Number,
      require: true,
    },
    value: {},
    pool: {
      type: Object,
      required: true,
    },
    tokentToNUSD: {
      required: true,
    },
  },
  watch: {
    reset(value) {
      if (value) this.resetData();
    },
  },
  methods: {
    resetData() {
      this.activePercent = null;
      this.isCustom = false;
      this.customValue = "";
    },
  },
  computed: {
    nxusdAmountDisplay() {
      return (
        parseFloat(this.$store.getters.getUserBorrowPart(this.pool.id)) +
        parseFloat(this.nxusdAmount || 0)
      ).toFixed(8);
    },
    borrowPart() {
      const borrowPart = this.$store.getters.getUserBorrowPart(this.pool.id);
      return borrowPart.slice(0, 4);
    },
    tokenPrice() {
      const tokenToNUSD = 1 / this.$store.getters.getTokenPrice(this.pool.id);
      return tokenToNUSD;
    },
    stableCoinMultiplyer() {
      if (this.$store.getters.getPoolLtv(this.pool.id) === 90) {
        return 10;
      }
      return 1;
    },
    liquidityPriceFormatted() {
      return this.liquidityPrice === "xxx.xx" || !this.liquidityPrice
        ? "xxx.xx"
        : parseFloat(this.liquidityPrice).toFixed(8);
    },
    priceDifference() {
      const priceDifference = this.tokenPrice - this.liquidityPrice;
      return priceDifference;
    },
    liquidationRisk() {
      if (
        +this.$store.getters.getUserBorrowPart(this.pool.id) +
          parseFloat(this.nxusdAmount) ===
          0 ||
        isNaN(this.liquidityPrice)
      )
        return parseFloat("0").toFixed(2);

      const riskPersent =
        ((this.priceDifference * this.stableCoinMultiplyer) / this.tokenPrice) *
        100;

      if (riskPersent > 100) {
        return 100;
      }

      return parseFloat(riskPersent).toFixed(2);
    },
  },
};
</script>

<style lang="scss" scoped>
.estimation-block {
  display: flex;
  flex-direction: column;

  .item-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 12px;

    &:last-of-type {
      margin-bottom: 0px;
    }
  }
  .title {
    display: flex;
    align-items: center;
    p {
      max-width: 210px;
      text-align: left;
    }
  }
  .position-health-text {
    color: #fdd33f;
    font-weight: 600;
  }
  .percent-text {
    font-weight: 600;
    margin-left: auto;
  }
  span {
    font-weight: 600;
  }
}
</style>
