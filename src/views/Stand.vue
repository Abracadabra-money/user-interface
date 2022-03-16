<template>
  <div v-if="isConnected()" class="stand-view">
    <div class="container mini">
      <div class="stand-group">
        <h1>nUSD Markets</h1>
        <StandTable :tableType="2" :items="pools" />
      </div>
    </div>
  </div>
  <div v-else class="stand-action-view">
    <ActionComponent
      :text="text"
      :name="name"
      :onClick="walletBtnHandler"
      :disabled-status="disabledStatus"
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
      disabledStatus: false,
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
  },
  methods: {
    isConnected() {
      return this.$store.getters.getWalletIsConnected;
    },
    async walletBtnHandler() {
      if (this.isWalletConnected || !window.ethereum) {
        return false;
      }

      this.disabledStatus = true;

      try {
        await this.$store.dispatch("connectAccount", window.ethereum);
      } catch (e) {
        console.log("e:", e);
      }

      this.disabledStatus = false;
    },
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
.stand-action-view {
  position: relative;
  flex: 1;
  background: #1C1C1C;
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
