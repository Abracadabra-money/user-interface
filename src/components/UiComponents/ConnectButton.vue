<template>
  <button
    class="btn mini connect-btn"
    :class="{ load: connectLoader }"
    @click="walletBtnHandler"
    @mouseenter="itsHover = true"
    @mouseleave="itsHover = false"
  >
    <ButtonLoader v-if="connectLoader" />
    <template v-else-if="itsHover"> dashboard </template>
    <template v-else>
      {{ walletBtnText }}
    </template>
  </button>
</template>

<script>
const ButtonLoader = () => import("@/components/UiComponents/ButtonLoader");

export default {
  data() {
    return {
      itsHover: false,
      connectLoader: false,
      btnText: "Connect wallet",
    };
  },
  computed: {
    walletBtnText() {
      let account = this.$store.getters.getAccount;

      if (account) {
        let startAddr = account.slice(0, 6);
        let endAddr = account.slice(-6);

        return `${startAddr}...${endAddr}`;
      } else {
        return "Connect wallet";
      }
    },
    isWalletConnected() {
      return this.$store.getters.getWalletIsConnected;
    },
  },
  methods: {
    async walletBtnHandler() {
      if (this.isWalletConnected) {
        this.toDashboard();
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
    toDashboard() {
      this.$router.push({ name: "Dashboard" });
    },
  },
  components: {
    ButtonLoader,
  },
};
</script>

<style lang="scss" scoped></style>
