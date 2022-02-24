<template>
  <div class="stand-view">
<!--    <img src="@/assets/images/stand/bg-top-left.svg" alt="" class="bg-1" />-->
<!--    <img src="@/assets/images/stand/bg-btm-right.svg" alt="" class="bg-2" />-->
<!--    <img src="@/assets/images/stand/bg-btm-left.svg" alt="" class="bg-3" />-->

    <div class="container mini">
      <div class="stand-group">
        <h1>LET’S SUMMON SOME MIM<span>s</span></h1>

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
  padding-top: 30px;
  padding-bottom: 300px;
  position: relative;
  flex: 1;

  .bg-1 {
    position: absolute;
    top: -$headerHeight;
    left: 0;
    width: 25%;
    max-width: 360px;
    min-width: 160px;
  }

  .bg-2 {
    position: absolute;
    bottom: -$footerHeight;
    right: 0;
    width: 25%;
    max-width: 360px;
    min-width: 160px;
  }

  .bg-3 {
    position: absolute;
    bottom: -$footerHeight;
    left: 0;

    width: 33%;
    max-width: 485px;
    min-width: 160px;
  }

  .stand-group {
    padding-top: 100px;
    position: relative;
    z-index: 2;

    h1 {
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 60px;

      span {
        text-transform: lowercase;
      }
    }
  }
}

@media screen and(max-width: 980px) {
  .stand-view .bg-1,
  .stand-view .bg-2,
  .stand-view .bg-3 {
    display: none;
  }

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
