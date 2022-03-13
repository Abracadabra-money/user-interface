<template>
  <div v-if="isConnected()" class="stand-view">
    <div class="container mini">
      <div class="stand-group">
        <h1>LET’S SUMMON SOME MIM<span>s</span></h1>
        <StandTable :tableType="2" :items="pools" />
      </div>
    </div>
  </div>
  <div v-else>
    <ActionComponent
      :text="text"
      :name="name"
      :onClick="walletBtnHandler"
    />
  </div>
</template>

<script>
const StandTable = () => import("@/components/Stand/Table");
const ActionComponent = () => import("@/components/UiComponents/ActionComponent");

export default {
  data() {
    return {
      text: "Please connect your wallet",
      name: "Connect",
    }
  },
  components: {
    StandTable,
    ActionComponent,
  },
  computed: {
    pools() {
      return this.$store.getters.getPools;
    },
    isWalletConnected() {
      return this.$store.getters.getWalletIsConnected;
    },
  },
  methods: {
    isConnected() {
      if (this.isWalletConnected) {
        return true;
      } else {
        return false;
      }
    },
    async walletBtnHandler() {
      if (this.isWalletConnected) {
        return false;
      }

      if (!window.ethereum) return false;

      this.connectLoader = true;

      try {
        await this.$store.dispatch("connectAccount", window.ethereum);
      } catch (e) {
        console.log("e:", e);
      }

      this.connectLoader = false;
    },
  },
  // created() {
  //   const isConnected = this.$store.getters.getWalletIsConnected;
  //
  //   if (!isConnected) {
  //     this.$router.push({ name: "Home" });
  //     alert("Connect wallet first");
  //     return false;
  //   }
  // },
};
</script>

<style lang="scss" scoped>
.stand-view {
  padding-top: 30px;
  padding-bottom: 300px;
  position: relative;
  flex: 1;

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
