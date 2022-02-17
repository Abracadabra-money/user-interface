<template>
  <div class="swap-popup">
    <img
      src="@/assets/images/close-popup.svg"
      alt=""
      class="close-btn"
      @click="closePopup"
    />

    <p class="title">{{ action }}</p>

    <p class="subtitle">
      Make SPELL work for you! Stake your SPELL and gain sSPELL. No impermanent
      loss, no loss of governance rights. Continuously compounding. After each
      new deposit, all staked SPELL are subject to a 24H lock-up period!
    </p>

    <p class="subtiitle">
      sSPELL automatically earns fees from MIM repayments from all wizards
      proportional to your share of the stake pool.
    </p>

    <p class="balance-text">
      Balance: {{ parseFloat(balance || 0).toFixed(4) }}
    </p>

    <div class="target-row">
      <p class="label-text">From</p>
      <ValueInput
        :max="balance || 0"
        :valueName="fromToken"
        @onchange="updateMainValue"
        :parentValue="amount"
        :error="amountError"
      />
    </div>

    <img src="@/assets/images/pixel-two-arrow.svg" alt="" class="swap-icon" />

    <div class="target-row to-row">
      <p class="label-text">To</p>
      <ValueInput
        :valueName="toToken"
        :parentValue="toTokenAmount"
        :disabled="true"
      />
    </div>

    <button class="btn approve-btn" @click="actionHandler" :disabled="!amount">
      {{ action }}
    </button>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UiComponents/ValueInput");
export default {
  data() {
    return {
      balance: "",
      action: "",
      amount: "",
      amountError: "",
      tokenRate: 1,
    };
  },
  computed: {
    sSpellTokenObject() {
      return this.$store.getters.getSSpellObject;
    },
    fromToken() {
      if (this.action === "stake")
        return this.sSpellTokenObject.stakeToken.name;
      if (this.action === "unstake")
        return this.sSpellTokenObject.mainToken.name;

      return "";
    },
    toToken() {
      if (this.action === "stake") return this.sSpellTokenObject.mainToken.name;
      if (this.action === "unstake")
        return this.sSpellTokenObject.stakeToken.name;

      return "";
    },
    toTokenAmount() {
      if (!this.amount) return "";

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.action === "stake") {
        const amount = this.amount / this.tokenRate;
        return amount.toString().match(re)[0];
      }
      if (this.action === "unstake") {
        const amount = this.amount * this.tokenRate;
        return amount.toString().match(re)[0];
      }
      return "";
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    updateMainValue(value) {
      if (+value > +this.balance) {
        this.amountError = `The value cannot be greater than ${this.balance}`;
        return false;
      }

      this.amountError = "";
      this.amount = value;
    },
    async getBalance() {
      let contract;
      if (this.action === "stake") {
        contract = this.sSpellTokenObject.stakeToken.contractInstance;
      }
      if (this.action === "unstake") {
        contract = this.sSpellTokenObject.mainToken.contractInstance;
      }

      if (!contract) {
        console.log("No contract!");
      }

      try {
        const balance = await contract.balanceOf(this.account);

        this.balance = this.$ethers.utils.formatEther(balance.toString());
        console.log();
      } catch (e) {
        console.log("getUserBalance err:", e);
      }
    },
    async getSpellRate() {
      const spellContract = this.sSpellTokenObject.stakeToken.contractInstance;
      const sspellContract = this.sSpellTokenObject.mainToken.contractInstance;
      try {
        const sspellBalance = await spellContract.balanceOf(
          sspellContract.address
        );
        const totalSupply = await sspellContract.totalSupply();

        const parsedBalance = this.$ethers.utils.formatEther(
          sspellBalance.toString()
        );
        const parsedTotalSupply = this.$ethers.utils.formatEther(totalSupply);
        console.log("parsedBalance", parsedBalance);
        console.log("parsedTotalSupply", parsedTotalSupply);

        const tokenRate = parsedBalance / parsedTotalSupply;

        console.log("tokenRate", tokenRate);

        return tokenRate;
      } catch (e) {
        console.log("getUserBalance err:", e);
      }
    },
    async actionHandler() {
      if (this.action === "stake") {
        const isApproved = await this.isTokenApprowed(
          this.sSpellTokenObject.stakeToken.contractInstance
        );

        if (isApproved) {
          await this.stake();
          return false;
        }

        const approvedSuccess = await this.approveToken(
          this.sSpellTokenObject.stakeToken.contractInstance
        );
        if (approvedSuccess) await this.stake();
      }
      if (this.action === "unstake") {
        await this.unstake();
      }
    },
    async stake() {
      console.log("STAKE");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.sSpellTokenObject.mainToken.contractInstance.estimateGas.mint(
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.sSpellTokenObject.mainToken.contractInstance.mint(
          amount,
          {
            gasLimit,
          }
        );

        this.closePopup();
        const receipt = await tx.wait();

        console.log("stake", receipt);
      } catch (e) {
        console.log("stake err:", e);
      }
    },
    async unstake() {
      console.log("UNSTAKE");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.sSpellTokenObject.mainToken.contractInstance.estimateGas.burn(
            this.account,
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.sSpellTokenObject.mainToken.contractInstance.burn(
          this.account,
          amount,
          {
            gasLimit,
          }
        );

        this.closePopup();
        const receipt = await tx.wait();

        console.log("stake", receipt);
      } catch (e) {
        console.log("stake err:", e);
      }
    },
    async isTokenApprowed(tokenContract) {
      try {
        const addressApprowed = await tokenContract.allowance(
          this.account,
          this.sSpellTokenObject.mainToken.contractInstance.address,
          {
            gasLimit: 1000000,
          }
        );

        console.log(
          "SPELL TOKEN APPROVE:",
          addressApprowed,
          parseFloat(addressApprowed.toString()) > 0
        );
        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("SPELL isApprowed err:", e);
        return false;
      }
    },
    async approveToken(tokenContract) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          this.sSpellTokenObject.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await tokenContract.approve(
          this.sSpellTokenObject.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();
        console.log("APPROVE RESP:", receipt);
        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },
  },
  async created() {
    const action = this.$store.getters.getPopupData.type;

    if (!action) this.$emit("close");

    this.action = action;

    await this.getBalance();
    this.tokenRate = await this.getSpellRate();
  },
  components: {
    ValueInput,
  },
};
</script>

<style lang="scss" scoped>
.swap-popup {
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
    padding-bottom: 25px;
  }

  .subtitle {
    padding-bottom: 5px;
  }

  .balance-text {
    text-align: right;
    padding-top: 20px;
  }

  .target-row {
    margin-bottom: 10px;

    &.to-row {
      margin-top: -18px;
    }

    .label-text {
      margin-bottom: 10px;
      text-align: left;
    }
  }

  .swap-icon {
    width: 42px;
    height: 42px;
    object-fit: contain;
  }

  .btn {
    margin-top: 20px;
    margin-left: auto;
  }
}

@media screen and(max-width: 640px) {
  .swap-popup {
    padding: 20px 10px;
  }
}
</style>
