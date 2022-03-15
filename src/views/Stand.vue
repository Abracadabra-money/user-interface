<template>
  <div class="stand-view">
    <div class="container mini">
      <div class="stand-group">
        <h1>nUSD Markets</h1>

        <StandTable :tableType="2" :items="pools" />
      </div>
    </div>
  </div>
</template>

<script>
const StandTable = () => import("@/components/Stand/Table");

export default {
  components: {
    StandTable,
  },
  computed: {
    pools() {
      return this.$store.getters.getPools;
    },
  },
  created() {
    const isConnected = this.$store.getters.getWalletIsConnected;

    if (!isConnected) {
      this.$router.push({ name: "Home" });
      alert("Connect wallet first");
      return false;
    }
  },
};
</script>

<style lang="scss" scoped>
.stand-view {
  padding: 40px 0;
  position: relative;
  flex: 1;

  .stand-group {
    position: relative;
    z-index: 2;

    h1 {
      text-align: left;
      margin-bottom: 24px;
      font-size: 32px;
      line-height: 36px;
    }
  }
}

@media screen and(max-width: 980px) {

  .stand-view .stand-group:first-child {
    padding-top: 30px;
  }
}

@media screen and(max-width: 780px) {
}

@media screen and(max-width: 640px) {
  .stand-view .stand-group h1 {
    margin-bottom: 30px;
  }

  .stand-view {
    padding-bottom: 100px;
  }
}
</style>
