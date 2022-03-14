<template>
  <div v-if="isConnected()">
    <button
      class="btn mini connected-btn"
      :class="{ load: connectLoader, connected: isWalletConnected }"
      @click="walletBtnHandler"
      @mouseenter="itsHover = true"
      @mouseleave="itsHover = false"
    >
      <ButtonLoader v-if="connectLoader"/>
      <template v-else-if="itsHover"> Dashboard </template>
      <template v-else>
        <div>
          {{ walletBtnText}}
          <p class="slicedAddress">{{slicedAccountAddress}} </p>
        </div>
      </template>
    </button>
  </div>

  <div v-else>
    <button
      class="btn mini connect-btn"
      :class="{ load: connectLoader, connected: isWalletConnected }"
      @click="walletBtnHandler"
    >
      <ButtonLoader v-if="connectLoader"/>
      <template v-if="itsHover"> Dashboard </template>
      <template v-else>
        {{ connectBtnText }}
      </template>
    </button>
  </div>
</template>

<script>
// import ethIcon from "@/assets/images/networks/ethereum-icon.svg";
// import binanceIcon from "@/assets/images/networks/binance-icon.svg";
// import fantomIcon from "@/assets/images/networks/fantom-icon.svg";
import avaxIcon from "@/assets/images/networks/avalanche-avax-icon.svg";

const ButtonLoader = () => import("@/components/UiComponents/ButtonLoader");

export default {
  props: {
    networkType: {
      type: String,
      default: "0xa86a",
    },
  },
  data() {
    return {
      itsHover: false,
      connectLoader: false,
      btnText: "Connect",

      networks: [
        // {
        //   chainid: "0x1",
        //   title: "ERC-20",
        //   icon: ethIcon,
        // },
        // {
        //   chainid: "0x38",
        //   title: "BSC",
        //   icon: binanceIcon,
        // },
        // {
        //   chainid: "0xfa",
        //   title: "FANTOM",
        //   icon: fantomIcon,
        // },
        {
          chainid: "0xa86a",
          title: "Avax Network",
          icon: avaxIcon,
        },
        {
          chainid: "0xa869",
          title: "Avax Fuji",
          icon: avaxIcon,
        },
        // {
        //   chainid: "0x539",
        //   title: "Avax local",
        //   icon: avaxIcon,
        // },
      ],
    };
  },
  computed: {
    walletBtnText() {
      let networkType = this.$store.getters.getChainId;
      let networkName = this.networks.find((item) => item.chainid == networkType);

      return `${networkName.title}`;
    },
    slicedAccountAddress() {
      let account = this.$store.getters.getAccount;
      let startAddr = account.slice(0, 4);
      let endAddr = account.slice(-4);

      return `${startAddr}...${endAddr}`;
    },
    connectBtnText() {
      return this.btnText;
    },
    isWalletConnected() {
      return this.$store.getters.getWalletIsConnected;
    },
  },
  methods: {
    isConnected() {
      if(this.isWalletConnected){
        return true;
      } else {
        return false;
      }
    },
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
<style lang="scss" scoped>
.slicedAddress {
  height: 16px;
  width: 65px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: center;
  color: #FFFFFF;
  opacity: 50%;
}

.connected-btn {
  height: 40px;
  width: 104px;
  border-radius: 100px;
  margin: 24px 0px;

  //Typography
  font-family: Work Sans, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;

  line-height: 16px;
  letter-spacing: 0em;
  text-align: center;
  padding: 4px 12px;
  background: rgba(28, 28, 28, 0.16);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.connect-btn {
  background: #E7FC6E;
  border-radius: 21px;

  height: 32px;
  width: 90px;
  padding: 6px 16px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;

  text-align: center;
  color: #000000;
}
</style>