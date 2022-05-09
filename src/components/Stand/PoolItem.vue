<template>
  <div
    class="stand-table-item"
    :class="{ 'stand-table-disable': !pool.isEnabled }"
    @click="toPool"
  >
    <div class="table-col pool-name">
      <div class="val-item">
        <div class="item-wrapper">
          <TokenIcon :token="pool.token.name" />
          <p>
            {{ pool.name }}
            <img
              v-if="isWTXPool"
              src="@/assets/images/i-icon.svg"
              alt=""
              class="info-icon"
              v-tooltip="'This is a private market.'"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="table-col">
      <p>{{ totalBorrow | formatNumber }}</p>
    </div>
    <div class="table-col">
      <p>{{ pool.dynamicBorrowAmount | formatNumber }}</p>
    </div>
    <div class="table-col">
      <p>{{ pool.stabilityFee }} <span>%</span></p>
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
      // return parseFloat(
      //   this.$ethers.utils.formatEther(this.pool.totalBorrow)
      // ).toFixed(0);
      return parseFloat(
        this.$ethers.utils.formatEther(
          this.$store.getters.getTotalBorrow(this.pool.id)
        )
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
    isWTXPool() {
      if (this.pool.token.name === "WXT") {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    toPool() {
      if (this.pool.isEnabled) {
        this.$router.push({ name: "Pool", params: { id: this.pool.id } });
      }
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
  justify-content: space-between;
  padding: 24px;
  background-color: $clrBlue2;
  margin-bottom: 1px;
  cursor: pointer;

  .info-icon {
    margin: 10px;
  }

  &:hover {
    box-shadow: 0 1px 0 0 $clrBlue6; /* Border bottom */
    box-shadow: 0 -1px 0 0 $clrBlue6; /* Border top */
    box-shadow: -1px 0 0 0 $clrBlue6; /* Border left */
    box-shadow: 1px 0 0 0 $clrBlue6; /* Border right */
    box-shadow: 0 0 0 1px $clrBlue6;
  }

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
    text-align: right;
    font-size: 16px;
    line-height: 24px;

    .val-item {
      .token-icon-wrap {
        width: 32px;
        height: 32px;
      }
    }

    &.pool-name {
      p {
        text-transform: inherit;
      }
    }

    p {
      span {
        color: #8a8a8a;
      }
      font-size: 16px;
      line-height: 24px;
    }
  }

  .val-item {
    display: flex;
    align-items: center;
    .token-icon-wrap {
      .token-icon {
        max-width: none !important;
      }
    }
    .item-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      .info-icon {
        margin: 0;
      }
    }
  }

  .val-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    margin-right: 10px;
  }
}
.stand-table-disable {
  cursor: not-allowed;
  &:hover {
    box-shadow: none;
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
    padding-left: 20px;
    padding-right: 20px;
    justify-content: space-between;
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
    .token-icon-wrap {
      margin: 0;
    }
    .item-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .stand-table-item .val-icon {
    margin-bottom: 5px;
  }
}
</style>
