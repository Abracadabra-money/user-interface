<template>
  <button class="token-btn" @click="addToken">
    <img :src="tokenIcon" alt="" />
  </button>
</template>

<script>
import tokensInfo from "@/utils/tokens/addedTokens.js";

export default {
  props: {
    tokenName: {
      type: String,
      required: true,
    },
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
    tokenIcon() {
      const tokenImage = require(`@/assets/images/tokens-icon/Token_${this.tokenName}.svg`);

      return tokenImage || require("@/assets/images/tokens-icon/Token_ETH.svg");
    },
    tokenInfo() {
      return tokensInfo.find((token) => token.name === this.tokenName);
    },
  },
  methods: {
    async addToken() {
      if (!this.account) {
        return false;
      }

      const { ethereum } = window;

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: this.tokenInfo.address, // The address that the token is at.
              symbol: this.tokenInfo.symbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: this.tokenInfo.decimals, // The number of decimals in the token
              image: this.tokenInfo.image, // A string url of the token logo
            },
          },
        });

        if (wasAdded) {
          console.log("Thanks for your interest!");
        } else {
          console.log("Your loss!");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.token-btn {
  margin-left: 30px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;

  img {
    max-width: 100%;
    height: auto;
  }
}
</style>
