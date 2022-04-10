<template>
  <div class="estimation-block">
    <div class="item-main">
      <p>NXUSD Amount</p>
      <p class="percent-text" v-if="value"><span>~$ </span>{{nxusdAmount.toFixed(2)}}</p>
      <p class="percent-text" v-if="!value"><span>~$ </span>{{borrowPart}}</p>
    </div>

    <div class="item-main">
      <p>Expected Liquidation Price</p>
      <p class="percent-text" v-if="value"><span>~$ </span>{{liquidityPrice}}</p>
      <p class="percent-text" v-if="!value"><span>~$ </span>{{liquidationPrice.toFixed(2)}}</p>
    </div>

    <div class="item-main">
      <p>Position Health</p>
      <p class="position-health-text" >~ {{liquidityRisk}} %</p>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      //inputStatus: true,
    }
  },
  props: {
    liquidityPrice: {
      required: true,
    },

    reset: {
      type: Boolean,
    },
    nxusdAmount:{
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
    }
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
    borrowPart() {
      const borrowPart = this.$store.getters.getUserBorrowPart;
      return borrowPart.slice(0, 4);
    },
    tokenPrice() {
      const tokenToNUSD = 1 / this.$store.getters.getTokenPrice;
      return tokenToNUSD;
    },
    stableCoinMultiplyer() {
      if (this.$store.getters.getPoolLtv === 90) {
        return 10;
      }
      return 1;
    },
    stableCoinMultiplayer() {
      if (this.maxValue === 90) {
        return 10;
      }
      return 1;
    },
    liquidationPrice() {
      const liquidationMultiplier = (200 - this.$store.getters.getPoolLtv) / 100;

      const liquidationPrice =
        ((this.$store.getters.getUserBorrowPart * this.$store.getters.getTokenPrice) /
          this.$store.getters.getUserCollateralShare) *
        (1 / this.$store.getters.getTokenPrice) *
        liquidationMultiplier;

      return liquidationPrice;
    },
    priceDifference() {
      const priceDifference = this.tokenPrice - this.liquidationPrice;

      return priceDifference;
    },

    liquidityRisk() {
      if (+this.nxusdAmount === 0 || isNaN(this.liquidityPrice))
        return this.liquidationRisk;

      const riskPercent =  this.liquidityPrice / (this.liquidationPrice / (this.liquidationRisk / 100));

      return riskPercent.toFixed(2);
    },

    liquidationRisk() {
      if (+this.$store.getters.getUserBorrowPart === 0 || isNaN(this.liquidationPrice))
        return 0;

      const riskPersent =
        ((this.priceDifference * this.stableCoinMultiplyer) / this.tokenPrice) *
        100;

      if (riskPersent > 100) {
        return 100;
      }

      return parseFloat(riskPersent).toFixed(2);
    },
  },
}
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
    color: #FDD33F;
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
