<template>
  <div v-if="isConnected()">
    <button class="btn mini network-btn" @click="clickHandler">
      <img :src="activeNetwork.icon" alt="" />
      {{ activeNetwork.title }}
    </button>
  </div>
</template>


<script>
import ethIcon from "@/assets/images/networks/ethereum-icon.svg";
import binanceIcon from "@/assets/images/networks/binance-icon.svg";
import fantomIcon from "@/assets/images/networks/fantom-icon.svg";
import avaxIcon from "@/assets/images/networks/avalanche-avax-icon.svg";

export default {
  props: {
    networkType: {
      type: String,
      default: "0xa86a",
    },
  },
  data() {
    return {
      networks: [
        {
          chainid: "0xa86a",
          title: "AVAX",
          icon: avaxIcon,
        },
        {
          chainid: "0x38",
          title: "BSC",
          icon: binanceIcon,
        },
        {
          chainid: "0xfa",
          title: "FANTOM",
          icon: fantomIcon,
        },
        {
          chainid: 43113,
          title: "AVAX",
          icon: avaxIcon,
        },
        {
          chainid: "0x539",
          title: "AVAX",
          icon: avaxIcon,
        },
        {
          chainid: "0x1",
          title: "ERC-20",
          icon: ethIcon,
        },
      ],
    };
  },
  computed: {
    isWalletConnected() {
      return this.$store.getters.getWalletIsConnected;
    },
    activeNetwork() {
      return this.networks.find((item) => item.chainid == this.networkType);
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
    clickHandler() {
      // this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.network-btn {
  padding: 4px 12px;
  top: 0px;
  width: 91px;
  height: 32px;
  border-radius: 21px;
  background: rgba(28, 28, 28, 0.16);

  img {
    width: 24px;
    height: auto;
    margin-right: 10px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
