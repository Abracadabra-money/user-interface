<template>
  <div class="pool-stand">
    <h3>Withdraw collateral</h3>

    <WithdrawTokenItem
      v-for="(token, idx) in localTokens"
      :key="idx"
      :token="token"
      :max="userBalance"
      @updateValue="updateValue"
    />

    <div class="calculation-block">
      <div class="calculation-item">
        <p>You are about to withdraw from MIM3POOL</p>

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

    <button class="btn action-btn" @click="actionHandler">Withdraw</button>
  </div>
</template>

<script>
const WithdrawTokenItem = () =>
  import("@/components/Mim3Pool/WithdrawTokenItem");

export default {
  props: {
    tokens: { type: Array, required: true },
    userBalance: {},
  },
  data() {
    return {
      tokensAmounts: [],
      localTokens: [],
      isChanged: false,
    };
  },
  methods: {
    updateValue({ value, idx }) {
      const tokenItem = this.localTokens.find((item) => item.tokenIdx === idx);

      tokenItem.amount = value;

      this.isChanged = true;
    },
    actionHandler() {
      this.$emit("onWithdraw", {
        tokens: this.localTokens,
        isImbalance: this.isChanged,
      });
    },
    updateTokens() {
      this.localTokens = this.tokens.map((token) => {
        return {
          ...token,
          amount: token.tokenRate,
        };
      });
    },
  },
  created() {
    this.updateTokens();
  },
  components: {
    WithdrawTokenItem,
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
