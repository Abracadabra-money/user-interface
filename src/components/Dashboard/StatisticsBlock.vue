<template>
  <div class="statistics-block">
    <div class="item-wrap" v-for="(item, idx) in userStats" :key="idx">
      <TotalItem
        :type="item.type"
        :icon="item.icon"
        :amount="item.amount"
        :count="item.count"
      />
    </div>

    <div class="item-wrap cdp-item">
      <CdpBlock :pools="pools"></CdpBlock>
    </div>
  </div>
</template>

<script>
const TotalItem = () => import("@/components/Dashboard/TotalItem");
const CdpBlock = () => import("@/components/Dashboard/CdpBlock");
export default {
  props: {
    pools: {
      type: Array,
    },
  },
  methods: {
    updatedBorrowStat() {
      const userBorrowPools = this.pools.filter(
        (pool) => +pool.userBorrowPart > 0
      );

      const borrowAmount = userBorrowPools.reduce(function (
        accumulator,
        currentValue
      ) {
        return accumulator + +currentValue.userBorrowPart;
      },
      0);

      return {
        type: "borrow",
        icon: require("@/assets/images/coin.svg"),
        amount: parseFloat(borrowAmount).toFixed(4),
        count: userBorrowPools.length,
      };
    },
    updatedCollateralStat() {
      const userCollateralPools = this.pools.filter(
        (pool) => +pool.userCollateralShare > 0
      );

      const collateralAmount = userCollateralPools.reduce(
        (accumulator, currentValue) => {
          const parsedExchangeRate = this.$ethers.utils.formatUnits(
            currentValue.token.oracleExchangeRate.toString(),
            currentValue.token.decimals
          );

          const collateralInUsd =
            +currentValue.userCollateralShare / +parsedExchangeRate;

          return accumulator + collateralInUsd;
        },
        0
      );

      return {
        type: "collateral",
        icon: require("@/assets/images/bottle.svg"),
        amount: `$${parseFloat(collateralAmount).toFixed(4)}`,
      };
    },
  },
  computed: {
    userStats() {
      return [this.updatedBorrowStat(), this.updatedCollateralStat()];
    },
  },
  components: {
    TotalItem,
    CdpBlock,
  },
};
</script>

<style lang="scss" scoped>
.statistics-block {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  border-radius: 4px;
  background-color: $clrBg2;
  margin-bottom: 40px;

  .item-wrap {
    width: 300px;
  }
}

@media screen and(max-width: 1024px) {
  .statistics-block {
    flex-wrap: wrap;
    .item-wrap {
      margin-bottom: 20px;
      width: 49%;
      &.cdp-item {
        width: 100%;
        margin-bottom: 0;
      }
    }
  }
}

@media screen and(max-width: 780px) {
  .statistics-block {
    padding-left: 15px;
    padding-right: 15px;
  }

  .statistics-block .item-wrap {
    width: 100%;
  }
}
</style>
