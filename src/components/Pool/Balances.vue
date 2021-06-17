<template>
  <div class="balances-block">
    <h2>Your Balances</h2>

    <BalanceItem v-for="(item, idx) in balances" :item="item" :key="idx" />
  </div>
</template>

<script>
const BalanceItem = () => import("@/components/Pool/BalanceItem");

export default {
  props: {
    balances: {
      type: Array,
      required: true,
    },
  },
  components: {
    BalanceItem,
  },
};
</script>

<style scoped lang="scss">
.balances-block {
  padding: 30px 20px;
  background: $clrBg2;
  border-radius: 20px;

  h2 {
    margin-bottom: 20px;
  }
}

@media screen and(max-width: 780px) {
  .balances-block {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
