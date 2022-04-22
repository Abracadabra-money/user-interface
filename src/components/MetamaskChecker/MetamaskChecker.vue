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
        return false;
      }
      await this.checkConnection();
      // console.log( 'metamaskCheckError',chainId)
      // await this.$store.commit("detectProvider");
      // if (!provider) {
      //   return false;
      // }
      //
      // const userProvider = new this.$ethers.providers.Web3Provider(
      //   window.ethereum
      // );
      //
      // const userSigner = userProvider.getSigner();
      //
      // this.$store.commit("setMetamaskActive", true);
      // this.$store.commit("setProvider", userProvider);
      // this.$store.commit("setSigner", userSigner);
      //
      // await this.checkConnection();
    },
    async checkConnection() {
      const address = await this.$store.getters.getAccount;
      console.log("address", address);
      if (!address) {
        this.$emit("checkError", "");
        this.checkInProgress = false;
        return false;
      }
      const chainId = await this.$store.getters.getChainId;
      this.compareNetworkSupport(chainId);
      console.log("chain", chainId);
      this.setAccountListeners();
      this.checkInProgress = false;
      this.$emit("checkSuccess");
      //
      // this.$store.commit("setWalletConnection", true);
      // const chainId = await this.$store.dispatch(
      //   "fetchChainId",
      //   window.ethereum
      // );
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
        if (routeName !== "Home") this.$router.push({ name: "Home" });
      }

      if (networkObject) this.$store.commit("setActiveNetwork", chainId);
    },
    setAccountListeners() {
      const walletConnectProvider = new WalletConnectProvider({
        bridge: "https://bridge.walletconnect.org",
        rpc: {
          43113: "https://api.avax-test.network/ext/bc/C/rpc",
          43114: "https://api.avax.network/ext/bc/C/rpc",
        },
      });
      walletConnectProvider.on("disconnect", this.reload);
      walletConnectProvider.on("session_update", this.reload);
      console.log("SET METAMASK ACCOUNT LISTENERS FUNC");
      if(window.ethereum){
        window.ethereum.on("chainChanged", this.reload);
        window.ethereum.on("accountsChanged", this.onAccountChange);
      }
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
      if (routeName !== "Home") this.$router.push({ name: "Home" });

      this.$emit("checkError", "Please connect to MetaMask.");
    },
  },
  created() {
    this.checkProvider();
  },
};
</script>
