<template>
  <button class="btn mini network-btn" @click="clickHandler">
    <img :src="activeNetwork.icon" alt="" />

    {{ activeNetwork.title }}
  </button>
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
          chainid: "0x1",
          title: "ERC-20",
          icon: ethIcon,
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
          chainid: "0xa86a",
          title: "AVAX",
          icon: avaxIcon,
        },
        {
          chainid: "0x539",
          title: "AVAX local",
          icon: avaxIcon,
        },
      ],
    };
  },
  computed: {
    activeNetwork() {
      return this.networks.find((item) => item.chainid == this.networkType);
    },
  },
  methods: {
    clickHandler() {
      // this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.network-btn {
  width: 120px;
  background: rgba(255, 255, 255, 0.1);

  img {
    width: 12px;
    height: auto;
    margin-right: 10px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
