<template>
  <div class="deposit-popup">
    <img
      src="@/assets/images/close-popup.svg"
      alt=""
      class="close-btn"
      @click="closePopup"
    />

    <p class="title">Unstake</p>

    <p class="balance-text">Balance: {{ userBalance }}</p>

    <div class="input-wrap">
      <ValueInput
        :max="userBalanceExact"
        @onchange="updateMainValue"
        :parentValue="amount"
        :valueName="pool.stakingTokenName"
      />
    </div>

    <button
      class="btn"
      :disabled="!amount || amount == 0"
      @click="unstakeHandler"
    >
      Unstake
    </button>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UiComponents/ValueInput");
export default {
  data() {
    return {
      pool: null,
      userBalance: null,
      userBalanceExact: null,
      amount: "",
      amountError: "",
    };
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    async getDeposited() {
      try {
        const deposited = await this.pool.contractInstance.userInfo(
          this.pool.poolId,
          this.account
        );

        this.userBalanceExact = this.$ethers.utils.formatEther(
          deposited?.amount.toString()
        );

        this.userBalance = parseFloat(this.userBalanceExact).toFixed(2);

        console.log("getDeposited", parseFloat(this.userBalance));
      } catch (error) {
        console.log("getDeposited err:", error);
      }
    },
    async unstakeHandler() {
      try {
        const parseAmount = this.$ethers.utils.parseEther(
          this.amount.toString()
        );

        const tx = await this.pool.contractInstance.withdraw(
          this.pool.poolId,
          parseAmount
        );

        this.closePopup();

        const receipt = await tx.wait();

        console.log("unstakeHandler success:", receipt);
      } catch (error) {
        console.log("unstakeHandler err:", error);
      }
    },
    updateMainValue(value) {
      if (value > this.maxMainValue) {
        this.amountError = `The value cannot be greater than ${this.userBalance}`;
        return false;
      }

      this.mainValueError = "";
      this.amount = value;
    },
  },
  async created() {
    const poolId = this.$store.getters.getPopupData.poolId;

    if (!poolId) this.$emit("close");

    const pool = this.$store.getters.getFarmPoolById(poolId);
    if (!pool) this.$emit("close");

    this.pool = pool;

    await this.getDeposited();
  },
  components: {
    ValueInput,
  },
};
</script>

<style lang="scss" scoped>
.deposit-popup {
  padding: 20px;
  padding-bottom: 35px;
  background: $clrBg2;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  width: 95%;
  max-width: 590px;
  position: relative;
  margin-left: auto;
  margin-right: auto;

  .input-wrap {
    margin-bottom: 20px;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    object-fit: contain;
  }

  .title {
    font-size: 24px;
    line-height: 1.7;
    text-transform: uppercase;
    margin-bottom: 45px;
  }

  .balance-text {
    text-align: right;
    margin-bottom: 15px;
  }

  .btn {
    margin-top: 20px;
    margin-left: auto;
  }
}
</style>
