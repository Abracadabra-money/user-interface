<template>
  <div class="stand-table">
    <TableHead :tableType="tableType" />

    <div class="items-wrap" v-if="tableType === 1">
      <TableItem v-for="pool in items" :key="pool.id" :pool="pool" />
    </div>

    <div class="items-wrap" v-if="tableType === 2">
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

}
</style>
