<template>
  <div class="stand-table">
    <TableHead :tableType="tableType" />

    <div class="items-wrap" v-if="tableType === 1">
      <!-- <p class="temp-text">Coming soon</p> -->
      <TableItem v-for="pool in items" :key="pool.id" :pool="pool" />
    </div>

    <div class="items-wrap" v-if="tableType === 2">
      <!-- <p class="temp-text">Coming soon</p> -->
      <PoolItem v-for="pool in items" :key="pool.id" :pool="pool" />
    </div>
  </div>
</template>

<script>
const TableHead = () => import("@/components/Stand/TableHead");
const PoolItem = () => import("@/components/Stand/PoolItem");
const TableItem = () => import("@/components/Stand/TableItem");

export default {
  props: {
    tableType: {
      default: 1,
    },
    items: {
      type: Array,
    },
  },
  data() {
    return {
      poolTop: [
        {
          name: "curve MIM-3 pool",
        },
        {
          name: "ETH-SPELL",
        },
        {
          name: "IDO (B-Curve) MISO",
        },
      ],
      poolBtm: [
        {
          name: "yvWETH v2",
          fee: "12.5%",
          interest: "1.5%",
        },
        {
          name: "yvUSDC v2",
          fee: "3%",
          interest: "0.8%",
        },
        {
          name: "yvYFI v2",
          fee: "12.5%",
          interest: "1.5%",
        },
        {
          name: "yvUSDT v2",
          fee: "3%",
          interest: "0.8%",
        },
        {
          name: "xSUSHI",
          fee: "12.5%",
          interest: "1.5%",
        },
      ],
    };
  },
  components: {
    TableHead,
    TableItem,
    PoolItem,
  },
};
</script>

<style scoped lang="scss">
.items-wrap {
  position: relative;

  .temp-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 10;
    font-size: 40px;
    font-weight: 600;
  }
}
</style>
