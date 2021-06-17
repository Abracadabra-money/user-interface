<template>
  <div class="pool-stand">
    <h3>Deposit collateral</h3>

    <TokenItem
      v-for="(token, idx) in localTokens"
      :key="idx"
      :token="token"
      @updateValue="updateValue"
    />

    <div class="calculation-block">
      <div class="calculation-item">
        <p>You are about to deposit to MIM3POOL</p>

        <div class="amount-wrap">
          <p v-for="(token, idx) in localTokens" :key="idx">
            {{ token.amount || 0 }} {{ token.name }}
          </p>
        </div>
      </div>
      <div class="calculation-item">
        <p>Total Amount is</p>
        <div class="amount-wrap">
          <p>1234</p>
        </div>
      </div>
    </div>

    <button class="btn action-btn" @click="actionHandler">Deposit</button>
  </div>
</template>

<script>
const TokenItem = () => import("@/components/Mim3Pool/TokenItem");

export default {
  props: {
    tokens: { type: Array, required: true },
  },
  data() {
    return {
      tokensAmounts: [],
      localTokens: [],
    };
  },
  methods: {
    updateValue({ value, idx }) {
      const tokenItem = this.localTokens.find((item) => item.tokenIdx === idx);

      tokenItem.amount = value;

      // this.localTokens.splice(idx, 1, tokenItem)
    },
    actionHandler() {
      this.$emit("onDeposit", this.localTokens);
    },
    updateTokens() {
      this.localTokens = this.tokens.map((token) => {
        return {
          ...token,
          amount: "",
        };
      });
    },
  },
  created() {
    this.updateTokens();
  },
  components: {
    TokenItem,
  },
};
</script>

<style lang="scss" scoped>
.pool-stand {
  padding: 30px 20px;
  background: $clrBg2;
  border-radius: 20px;
  width: 100%;

  .action-btn {
    margin-left: auto;
  }

  .amount-wrap {
    text-align: right;
  }

  .calculation-block {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 20px;
    padding: 10px 20px;
    margin-bottom: 20px;

    .calculation-item {
      padding: 5px 0;
      display: flex;
      justify-content: space-between;
    }
  }

  h3 {
    margin-bottom: 30px;
    text-align: left;
    text-transform: uppercase;
  }
}

@media screen and(max-width: 780px) {
  .pool-stand {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
