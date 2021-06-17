<template>
  <div class="stand-table-item" @click="toPool">
    <div class="table-col pool-name">
      <div class="val-item">
        <TokenIcon :token="pool.token.name" />
        <p>{{ pool.name }}</p>
      </div>
    </div>
    <div class="table-col">
      <p>{{ collateralInUsd | formatNumber }}</p>
    </div>
    <div class="table-col">
      <div class="val-item">
        <p>{{ pool.dynamicBorrowAmount | formatNumber }}</p>
      </div>
    </div>
    <div class="table-col">
      <div class="val-item">
        <p>{{ pool.interest }}%</p>
      </div>
    </div>
    <div class="table-col">
      <p>{{ pool.stabilityFee }}%</p>
    </div>
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
  },
  computed: {
    totalBorrow() {
      return parseFloat(
        this.$ethers.utils.formatEther(this.pool.totalBorrow)
      ).toFixed(0);
    },
    mainTokenPrice() {
      return (
        1 /
        this.$ethers.utils.formatUnits(
          this.pool.token.oracleExchangeRate,
          this.pool.token.decimals
        )
      );
    },
    collateralParsed() {
      return this.$ethers.utils.formatUnits(
        this.pool.totalCollateralShare,
        this.pool.token.decimals
      );
    },
    collateralInUsd() {
      return this.collateralParsed * this.mainTokenPrice;
    },
  },
  methods: {
    toPool() {
      this.$router.push({ name: "Pool", params: { id: this.pool.id } });
    },
  },
  filters: {
    formatNumber(value) {
      if (!value) return value;
      if (Number(value) === 0) return value;

      const lookup = [
        { value: 0, symbol: "" },
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup
        .slice()
        .reverse()
        .find(function (item) {
          return parseFloat(value) >= item.value;
        });
      return (
        (parseFloat(value) / item.value).toFixed(0).replace(rx, "$1") +
        item.symbol
      );
    },
  },
  components: {
    TokenIcon,
  },
};
</script>

<style scoped lang="scss">
.stand-table-item {
  display: flex;
  align-items: center;
  padding: 13px 30px;
  background-color: $clrBlue2;
  border-radius: 12px;
  margin-bottom: 10px;
  min-height: 120px;
  cursor: pointer;

  &.hidden {
    filter: blur(2px);
    pointer-events: none;
  }

  &.lighter {
    background-color: $clrBlue3;
  }

  .action-col {
    width: 150px;
    padding-left: 30px;

    .btn {
      width: 100%;
      background: rgba(255, 255, 255, 0.1);

      &:first-child {
        margin-bottom: 10px;
      }
    }
  }

  .table-col {
    width: calc((100% - 150px) / 4);
    text-align: left;

    &.pool-name {
      p {
        text-transform: inherit;
      }
    }

    p {
      text-transform: uppercase;
      font-size: 16px;
      line-height: 1;
    }
  }

  .val-item {
    display: flex;
    align-items: center;
  }

  .val-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    margin-right: 10px;
  }
}

@media screen and(max-width: 780px) {
  .stand-table-item {
    flex-wrap: wrap;
    justify-content: center;
    min-height: 100px;

    .table-col {
      width: 20%;
    }

    .action-col {
      padding-left: 0;
      display: flex;
      align-items: center;
      width: auto;
      margin-top: 20px;

      .btn {
        width: 120px;
        margin: 0 5px;
      }

      .btn:first-child {
        margin-bottom: 0;
      }
    }
  }
}

@media screen and(max-width: 640px) {
  .stand-table-item {
    padding-left: 10px;
    padding-right: 10px;
  }

  .stand-table-item .table-col p {
    font-size: 12px;
  }

  .stand-table-item .val-icon {
    width: 24px;
    height: 24px;
  }

  .stand-table-item .val-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .stand-table-item .val-icon {
    margin-bottom: 5px;
  }
}
</style>
