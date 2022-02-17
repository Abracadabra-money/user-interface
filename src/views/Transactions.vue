<template>
  <div class="transactions-view">
    <div class="container mini">
      <BackButton :text="'Dashboard'" @click="toDashboard" />

      <h1>Transactions</h1>

      <template v-if="history && history.length">
        <TransactionsTable :history="history" />
      </template>

      <EmptyState v-else />
    </div>
  </div>
</template>

<script>
const BackButton = () => import("@/components/UiComponents/BackButton");
const TransactionsTable = () => import("@/components/Transactions/Table");
const EmptyState = () => import("@/components/Transactions/EmptyTransState");

export default {
  data() {
    return {
      history: null,
    };
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
    pools() {
      return this.$store.getters.getPools;
    },
  },
  methods: {
    toDashboard() {
      this.$router.push({ name: "Dashboard" });
    },
    async getUserHistory() {
      if (!this.pools || !this.pools.length) {
        console.log("No pools for history");
        return false;
      }

      const history = [];

      this.pools.forEach((pool) => {
        const logsBorrow = pool.contractInstance.filters.LogBorrow(
          this.account
        );
        const logsRepay = pool.contractInstance.filters.LogRepay(this.account);
        const logsAddCollaretal =
          pool.contractInstance.filters.LogAddCollateral(this.account);
        const logsRemoveCollaretal =
          pool.contractInstance.filters.LogRemoveCollateral(this.account);
        console.log(`LOGS:________${pool.name}_______`);
        console.log("logsBorrow", logsBorrow);
        console.log("logsRepay", logsRepay);
        console.log("logsAddCollaretal", logsAddCollaretal);
        console.log("logsRemoveCollaretal", logsRemoveCollaretal);
      });

      return history;
    },
  },
  async created() {
    this.history = await this.getUserHistory();
  },
  components: {
    BackButton,
    TransactionsTable,
    EmptyState,
  },
};
</script>

<style lang="scss" scoped>
.transactions-view {
  padding-top: 60px;
  padding-bottom: 100px;
  flex: 1;

  h1 {
    margin: 60px;
  }
}
</style>
