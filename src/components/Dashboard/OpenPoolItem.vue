<template>
  <div class="pool-item">
    <div class="item-head">
      <h2 v-if="actionType === 'borrow'">
        {{ actionType.toUpperCase() }} more
      </h2>
      <h2 v-if="actionType === 'repay'">{{ actionType.toUpperCase() }}</h2>
      <div class="status-item" v-if="false">
        <p>liquidation possibility</p>
      </div>
    </div>

    <div class="valutes-row">
      <div class="valute-item">
        <div class="value-type">
          <TokenIcon :token="pool.token.name" />
          <p>{{ pool.token.name }}</p>
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

    <div class="liquidation-info" v-if="false">
      <p class="price-text">Liquidation price <span>$xxx.xx</span></p>
      <button class="safe-status">Safe</button>
    </div>

    <button class="btn action-btn" @click="toPool">{{ actionType }}</button>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/UiComponents/TokenIcon");
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
  components: {
    TokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.pool-item {
  width: 100%;
  background: $clrBg2;
  border-radius: 20px;
  padding: 20px 20px 30px;

  .liquidation-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    background: rgba(34, 27, 71, 0.4);
    border-radius: 38px;
    padding: 10px 20px;
  }

  .price-text {
    text-align: left;
    span {
      padding-left: 10px;
    }
  }

  .action-btn {
    margin-left: auto;
  }

  .safe-status {
    width: 50px;
    height: 24px;
    outline: none;
    border: none;
    background: $clrBlue4;
    border-radius: 23px;
    font-size: 12px;
    color: $clrText;
  }

  .item-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
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
    background: rgba(34, 27, 71, 0.4);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    margin: 10px 0;
  }

  .valute-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc((100% / 2) - 10px);

    .value-type {
      display: flex;
      align-items: center;
      justify-content: center;

      .type-icon {
        width: 32px;
        height: 32px;
        object-fit: contain;
        margin-right: 10px;
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
