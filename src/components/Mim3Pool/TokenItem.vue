<template>
  <div class="token-item-wrap">
    <p class="balance-text">Balance: {{ balance | formatBalance }}</p>

    <div class="input-wrap">
      <ValueInput
        :max="balance"
        @onchange="updateMainValue"
        :parentValue="amount"
        :valueName="token.name"
        :error="amountError"
      />
    </div>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UiComponents/ValueInput");

export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      balance: 0,
      amount: this.token.amount,
      amountError: "",
    };
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
  },
  watch: {
    amount(value) {
      this.$emit("updateValue", { value, idx: this.token.tokenIdx });
    },
  },
  methods: {
    updateMainValue(value) {
      if (parseFloat(value) > parseFloat(this.balance)) {
        this.amountError = `The value cannot be greater than ${this.balance}`;
        return false;
      }

      this.amountError = "";
      this.amount = value;
    },
    async getUserBalance() {
      try {
        console.log("BALANCE OF: ", this.account);
        const userBalance = await this.token.contractInstance.balanceOf(
          this.account,
          {
            gasLimit: 600000,
          }
        );

        this.balance = this.$ethers.utils.formatUnits(
          userBalance.toString(),
          this.token.decimals
        );

        console.log("BALANCE", this.token.name, this.balance);
      } catch (e) {
        console.log("userBalance Err:", e);
      }
    },
  },
  async created() {
    await this.getUserBalance();
  },
  filters: {
    formatBalance(value) {
      return parseFloat(value).toFixed(2);
    },
  },
  components: {
    ValueInput,
  },
};
</script>

<style lang="scss" scoped>
.token-item-wrap {
  .balance-text {
    text-align: right;
    margin-bottom: 10px;
  }

  margin-bottom: 20px;
}
</style>
