<template>
  <div class="transactions-table">
    <TableHead />

    <div class="items-wrap">
      <TableItem
        v-for="(item, idx) in history"
        :key="idx"
        :historyItem="item"
      />
    </div>
  </div>
</template>

<script>
const TableHead = () => import("@/components/Transactions/TableHead");
const TableItem = () => import("@/components/Transactions/TableItem");

export default {
  props: {
    history: {
      type: Array,
      required: true,
    },
  },
  components: {
    TableHead,
    TableItem,
  },
};
</script>

<style scoped lang="scss"></style>
