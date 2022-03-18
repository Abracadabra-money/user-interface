<template>
  <div class="pool-item">
    <div class="item-head">
      <h2 v-if="actionType === 'borrow'">
        {{ actionType }} more
      </h2>
      <h2 v-if="actionType === 'repay'">{{ actionType }}</h2>
      <div class="status-item" v-if="false">
        <p>liquidation possibility</p>
      </div>
    </div>

    <div class="liquidation-bar-wrap">
      <LiquidationBar :pool="pool" />
    </div>

    <div class="valutes-row">
      <div class="valute-item">
        <div class="value-type">
          <TokenIcon :token="pool.token.name" />
          <p>{{ pool.name }}</p>
        </div>

        <p class="amount">
          ~ {{ parseFloat(pool.userCollateralShare).toFixed(2) }}
        </p>
      </div>
      <div class="valute-item">
        <div class="value-type">
          <TokenIcon :token="pool.pairToken.name" />
          <p>{{ pool.pairToken.name }}</p>
        </div>

        <p class="amount">~ {{ parseFloat(pool.userBorrowPart).toFixed(2) }}</p>
      </div>
    </div>

    <div class="liquidation-info" v-if="true">
      <p class="price-text">Liquidation price</p>
      <p class="price-value">{{ liquidationPrice.toFixed(4) || $xxx.xx }}</p>
      <button
        class="safe-status"
        :class="{
          safe: liquidationRisk > 75,
          medium: liquidationRisk > 5 && liquidationRisk <= 75,
          hight: liquidationRisk > 0 && liquidationRisk <= 5,
        }"
      >
        {{ liquidationRiskStatus }}
      </button>
    </div>

    <div class="item-foot">
      <p>1 {{pool.token.name}} = {{tokenPrice.toFixed(4)}} nUSD</p>
      <button class="btn action-btn" @click="toPool"><p>{{ actionType }}</p></button>
    </div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/UiComponents/TokenIcon");
const LiquidationBar = () => import("@/components/Pool/LiquidationBar");
export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
    actionType: {
      type: String,
      required: true,
    },
  },
  methods: {
    toPool() {
      this.$router.push({
        name: "Pool",
        params: { id: this.pool.id },
        query: { actionType: this.actionType },
      });
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
    liquidationRiskStatus() {
      let status = "";
      if (this.liquidationRisk > 75) {
        status = "Safe";
      } else if (this.liquidationRisk > 5 && this.liquidationRisk <= 75) {
        status = "Medium";
      } else if (this.liquidationRisk > 0 && this.liquidationRisk <= 5) {
        status = "High";
      }
      return status;
    },
  },
  components: {
    TokenIcon,
    LiquidationBar,
  },
};
</script>

<style lang="scss" scoped>
.pool-item {
  width: 100%;
  background: $clrBg2;
  border-radius: 4px;
  padding: 24px;

  .liquidation-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    background: $clrBg2;
    border: 1px solid #606060;
    border-radius: 4px;
    padding: 15px 12px;

    .price-value {
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .liquidation-bar-wrap {
    margin-bottom: 24px;
  }

  .price-text {
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }

  .action-btn {
    color: #000000;
    p::first-letter {
      text-transform: capitalize;
    }
  }

  .safe-status {
    padding: 1px 8px;
    outline: none;
    border: none;
    background: $clrBlue4;
    border-radius: 100px;
    font-size: 10px;
    line-height: 14px;
    color: $clrText;

    &.safe {
      background: #05D864;
    }

    &.medium {
      background: #FDD33F;
    }

    &.hight {
      background: #FE3366;
    }
  }

  .item-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;

    h2 {
      font-size: 16px;
      line-height: 24px;
      &::first-letter {
        text-transform: capitalize;
      }
    }
  }

  .item-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 14px;
      line-height: 20px;
    }
  }

  .status-item {
    background: $clrOrange;
    border-radius: 21px;
    height: 24px;
    padding: 0 10px;
    display: flex;
    align-items: center;

    p {
      font-size: 10px;
      text-transform: uppercase;
    }
  }

  .valutes-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .valute-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc((100% / 2) - 8px);
    border: 1px solid #FFFFFF;
    border-radius: 4px;
    padding: 11px;

    .value-type {
      font-size: 14px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        font-size: 14px;
        line-height: 20px;
      }

      .token-icon-wrap {
        width: 24px;
        height: 24px;
      }
    }
  }
}

@media screen and(max-width: 780px) {
  .pool-item {
    padding-left: 10px;
    padding-right: 10px;
  }

  .pool-item .price-text span {
    padding-left: 0;
  }

  .pool-item .valutes-row,
  .pool-item .liquidation-info {
    padding-left: 10px;
    padding-right: 10px;
  }
}

@media screen and(max-width: 480px) {
  .pool-item .valutes-row {
    flex-wrap: wrap;
  }
  .pool-item .valute-item {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
