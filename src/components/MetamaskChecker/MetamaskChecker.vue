<template>
  <div class="metamask-checker"></div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
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
      const provider = await detectEthereumProvider();
      if (!provider) {
        this.$store.commit("setPopupState", {
          type: "browser",
          isShow: true,
        });
        this.$emit("checkError", "Please install MetaMask!");
        return false;
      }

      if (provider !== window.ethereum) {
        this.$emit("checkError", "Do you have multiple wallets installed?");
        return false;
      }

      const userProvider = new this.$ethers.providers.Web3Provider(
        window.ethereum
      );

      const userSigner = userProvider.getSigner();

      this.$store.commit("setMetamaskActive", true);
      this.$store.commit("setProvider", userProvider);
      this.$store.commit("setSigner", userSigner);

      await this.checkConnection();
    },
    async checkConnection() {
      const address = await this.$store.dispatch(
        "fetchAccount",
        window.ethereum
      );

      if (!address) {
        this.$emit("checkError", "");
        this.checkInProgress = false;
        return false;
      }

      this.$store.commit("setWalletConnection", true);
      const chainId = await this.$store.dispatch(
        "fetchChainId",
        window.ethereum
      );
      this.compareNetworkSupport(chainId);
      this.setAccountListeners();

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
        if (routeName !== "Home") this.$router.push({ name: "Home" });
      }

      if (networkObject) this.$store.commit("setActiveNetwork", chainId);
    },
    setAccountListeners() {
      console.log("SET METAMASK ACCOUNT LISTENERS FUNC");
      window.ethereum.on("chainChanged", this.onChainIdChange);
      window.ethereum.on("accountsChanged", this.onAccountChange);
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
    onChainIdChange() {
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
