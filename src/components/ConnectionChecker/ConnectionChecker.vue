<template>
  <div class="metamask-checker"></div>
</template>

<script>
import WalletConnectProvider from "@walletconnect/client";
export default {
  data() {
    return {
      checkInProgress: true,
    };
  },
  computed: {
    availableNetworks() {
      return this.$store.getters.getAvailableNetworks;
    },
    walletIsConnected() {
      return this.$store.getters.getWalletIsConnected;
    },
    chainId() {
      return this.$store.getters.getChainId;
    },
  },
  watch: {
    walletIsConnected(value) {
      if (value && !this.checkInProgress) {
        this.compareNetworkSupport(this.chainId);
        this.setAccountListeners();
        this.$emit("checkSuccess");
      }
    },
  },
  methods: {
    async checkProvider() {
      const provider = await this.$store.dispatch("connectProvider");
      if (!provider) {
        this.$emit("checkError", "");
        this.checkInProgress = false;
        return false;
      }
      await this.checkConnection();
    },
    async checkConnection() {
      const address = await this.$store.getters.getAccount;
      if (!address) {
        this.$emit("checkError", "");
        this.checkInProgress = false;
        return false;
      }
      const chainId = await this.$store.getters.getChainId;
      this.compareNetworkSupport(chainId);
      await this.setAccountListeners();
      this.checkInProgress = false;
      this.$emit("checkSuccess");
    },
    compareNetworkSupport(chainId) {
      const networkObject = this.availableNetworks.find(
        (network) => network.chainId === chainId
      );

      if (chainId !== "0xa86a" && chainId !== "0x539" && chainId !== "0xa869") {
        this.$store.commit("setPopupState", {
          type: "wrong-network",
          isShow: true,
        });

        const routeName = this.$route.name;
        if (routeName !== "Stand") this.$router.push({ name: "Stand" });
      }

      if (networkObject) this.$store.commit("setActiveNetwork", chainId);
    },
    async setAccountListeners() {
      let accounts;
      if (window.ethereum) {
        accounts = await window.ethereum.request({ method: "eth_accounts" });
      }
      if (accounts && accounts.length > 0) {
        window.ethereum.on("chainChanged", this.reload);
        window.ethereum.on("accountsChanged", this.onAccountChange);
        window.ethereum.on("block", () => {
          this.updatePoolData();
        });
        console.log("SET METAMASK ACCOUNT LISTENERS FUNC");
      } else {
        const walletConnectProvider = new WalletConnectProvider({
          bridge: "https://bridge.walletconnect.org",
          rpc: {
            43113: "https://api.avax-test.network/ext/bc/C/rpc",
            43114: "https://api.avax.network/ext/bc/C/rpc",
          },
        });
        walletConnectProvider.on("disconnect", this.reload);
        walletConnectProvider.on("session_update", this.reload);
        walletConnectProvider.on("block", () => {
          this.updatePoolData();
        });
        console.log("SET WALLETCONNECT ACCOUNT LISTENERS FUNC");
      }
    },
    updatePoolData() {
      const poolData = this.$store.getters.getPools;
      console.log("poolData", poolData[0]);
    },
    onAccountChange(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log("Please connect to MetaMask.");

        this.disconnectHandler();
      } else {
        this.$store.commit("setAccount", accounts[0]);
      }
    },
    reload() {
      window.location.reload();
    },
    disconnectHandler() {
      console.log("disconnectHandler");

      this.$store.commit("closePopups");
      this.$store.commit("setAccount", null);
      this.$store.commit("setWalletConnection", false);
      this.$store.commit("setChainId", null);
      this.$store.commit("setActiveNetwork", "0x1");
      this.$store.commit("setFarmPools", []);
      this.$store.commit("setPools", []);
      this.$store.commit("setSwapObject", null);

      const routeName = this.$route.name;
      if (routeName !== "Stand") this.$router.push({ name: "Stand" });

      this.$emit("checkError", "Please connect to MetaMask.");
    },
  },
  created() {
    this.checkProvider();
  },
};
</script>
