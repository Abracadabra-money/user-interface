<template>
  <div class="liquidation-bar">

    <div class="main-wrap">

      <div class="info-wrap">
        <div class="image-wrap">
          <img
            src="@/assets/images/i-icon.svg"
            alt=""
            class="info-icon"
            v-tooltip="
          'This bar displays how healthy your position is. If it is empty, you will be flagged for liquidation. The bar is enlarged by 10x to allow better visual representation.'
        "
          />
        </div>
        <div class="indicator-wrap">
          <div class="amount-indicator" v-if="priceDifferens">
            <p>&lt;{{ parseFloat(priceDifferens).toFixed(6) }}$</p>
          </div>
          <div class="percent-indicator">
            <p>{{ liquidationRisk }}% of 100%</p>
          </div>
        </div>
      </div>

      <div class="range">
        <div
          class="range-indicator"
          :class="{
            safe: liquidationRisk > 75,
            medium: liquidationRisk > 5 && liquidationRisk <= 75,
            hight: liquidationRisk > 0 && liquidationRisk <= 5,
          }"
          :style="{ width: `${liquidationRisk}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
  },
  computed: {
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
    liquidationPrice() {
      const liquidationMultiplier = (200 - this.$store.getters.getPoolLtv) / 100;

      const liquidationPrice =
        ((this.$store.getters.getUserBorrowPart * this.$store.getters.getTokenPrice) /
          this.$store.getters.getUserCollateralShare) *
        (1 / this.$store.getters.getTokenPrice) *
        liquidationMultiplier;

      return liquidationPrice;
    },
    priceDifferens() {
      const priceDifferens = this.tokenPrice - this.liquidationPrice;

      return priceDifferens;
    },
    liquidationRisk() {
      if (+this.$store.getters.getUserBorrowPart === 0 || isNaN(this.liquidationPrice))
        return 0;

      const riskPersent =
        ((this.priceDifferens * this.stableCoinMultiplyer) / this.tokenPrice) *
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
.liquidation-bar {
  //background: $clrBg2;
  //border-radius: 12px;
  //padding: 7px 10px;
  display: flex;
  align-items: center;

  .image-wrap {
    //width: 24px;
    //height: 26px;
    display: flex;
    align-items: center;
    //position: relative;

    .info-icon {
      width: 13px;
      height: 13px;
    }
  }

  .range {
    background: #606060;
    //border: 1px solid #403b83;
    border-radius: 4px;
    display: flex;
    height: 12px;

    .range-indicator {
      height: 100%;
      //width: 39%;
      border-radius: 4px;
      transition: all 0.3s ease;

      &.safe {
        background: #FDD33F;
      }

      &.medium {
        background: #FDD33F;
      }

      &.hight {
        background: #FDD33F;
      }
    }
  }

  .main-wrap {
    flex: 1;
    //padding-left: 9px;
  }

  .amount-indicator {
    display: flex;
    align-items: center;
    margin-right: 18px;

    .coin-img {
      height: 12px;
      width: auto;
      object-fit: contain;
      margin-right: 3px;
    }
  }

  .info-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 6px;
  }
  .indicator-wrap {
    display: flex;
  }
}
</style>
