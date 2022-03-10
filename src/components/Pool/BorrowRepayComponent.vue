<template>
  <div class="deposit-borrow-block">
    <h3 v-if="actionType === 'borrow'">Deposit collateral</h3>
    <h3 v-if="actionType === 'repay'">Repay {{ tokenPairName }}</h3>

    <div class="checkbox-wrap" v-if="this.tokenName === 'WAVAX'">
      <div
        class="box-wrap"
        @click="toggleUseAVAX"
        :class="{ active: useAVAX }"
      >
        <div class="box"></div>
      </div>
      <p class="label-text" @click="toggleUseAVAX">Use AVAX</p>
    </div>

    <div class="input-wrap">
      <ValueInput
        :max="maxMainValue"
        @onchange="updateMainValue"
        :parentValue="mainValue"
        :error="mainValueError"
        :valueName="mainValueTokenName"
      />
    </div>

    <h3 v-if="actionType === 'borrow'">Borrow {{ tokenPairName }}</h3>
    <h3 v-if="actionType === 'repay'">Remove collateral</h3>

    <div class="input-wrap">
      <ValueInput
        :max="maxPairValue"
        :showMax="showMax"
        :valueName="pairValueTokenName"
        @onchange="updatePairValue"
        :parentValue="pairValue"
        :error="pairValueError"
      />
    </div>

    <div class="config-box" v-if="actionType === 'borrow'">
      <LiquidationRules
        :liquidationPrice="liquidationPrice"
        @onchange="updatePercentValue"
        :maxValue="ltv"
        :value="percentValue"
      />
    </div>

    <div class="config-box" v-if="actionType === 'borrow'">
      <div class="checkbox-wrap">
        <div
          class="box-wrap"
          @click="toggleShowLeverage"
          :class="{ active: showLeverage }"
        >
          <div class="box"></div>
        </div>
        <p class="label-text" @click="toggleShowLeverage">Change leverage</p>

        <img
          src="@/assets/images/i-icon.svg"
          alt=""
          class="info-icon"
          v-tooltip="'Some txt'"
        />
      </div>

      <template v-if="showLeverage">
        <transition name="fade">
          <SlipageBlock :slipage="slipage" @update="updateSlipage" />
        </transition>
        <transition name="fade">
          <LeverageBar :multiplier="multiplier" @update="updateMultiplier" />
        </transition>
      </template>
    </div>

    <div class="action-wrap">
      <div class="checkbox-wrap">
        <div
          class="box-wrap"
          @click="toggleUpdatePrice"
          :class="{ active: updatePrice }"
        >
          <div class="box"></div>
        </div>
        <p class="label-text" @click="toggleUpdatePrice">Update price</p>

        <img
          src="@/assets/images/i-icon.svg"
          alt=""
          class="info-icon"
          v-tooltip="'Update ibTKN price for a small gas fee'"
        />
      </div>

      <button
        class="btn action-btn"
        @click="actionHandler"
        :disabled="actionBtnText === 'Nothing to do'"
      >
        {{ actionBtnText }}
      </button>
    </div>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UiComponents/ValueInput");
const LiquidationRules = () => import("@/components/Pool/LiquidatonRules");
const LeverageBar = () => import("@/components/Pool/LeverageBar");
const SlipageBlock = () => import("@/components/Pool/SlipageBlock");

export default {
  props: {
    balance: {
      required: true,
    },
    balanceNativeToken: {
      required: false,
    },
    pairBalance: {
      require: true,
    },
    tokenName: {
      type: String,
      required: true,
    },
    tokenToUsd: {
      type: Number,
      default: 1,
    },
    tokenPairToUsd: {
      type: Number,
      default: 1,
    },
    tokenPairName: {
      type: String,
      required: true,
    },
    userTotalCollateral: {
      required: true,
    },
    userTotalBorrowed: {
      required: true,
    },
    actionType: {
      type: String,
      required: true,
    },
    tokenDecimals: {
      type: Number,
      required: true,
    },
    tokenPairDecimals: {
      type: Number,
      required: true,
    },
    ltv: {
      type: Number,
      required: true,
    },
    isUpdatePrice: {
      type: Boolean,
    },
  },
  data() {
    return {
      userBalance: null,
      userBalanceNativeToken: null,

      mainValue: "",
      mainValueError: "",

      pairValue: "",
      pairValueError: "",

      percentValue: "",

      updatePrice: this.isUpdatePrice,

      multiplier: 1,
      slipage: 1,
      showLeverage: false,
    };
  },
  watch: {
    actionType() {
      this.clearData();
    },
  },
  computed: {
    useAVAX() {
      return this.$store.getters.getUseAVAX;
    },
    liquidationMultiplier() {
      return (200 - this.ltv) / 100;
    },
    showMax() {
      if (this.actionType === "borrow") return false;

      return true;
    },
    maxMainValue() {
      const balance = this.getAVAXStatus()
        ? this.$store.getters.getBalanceNativeToken
        : this.$store.getters.getBalanceToken;

      if (this.actionType === "borrow") return balance;
      if (this.actionType === "repay") {
        if (
          parseFloat(this.$store.getters.getUserBorrowPart) >
          parseFloat(this.parsedPairBalance)
        )
          return this.parsedPairBalance;

        return this.$store.getters.getUserBorrowPart;
      }

      return 0;
    },
    mainValueTokenName() {
      const tokenSymbol = this.getAVAXStatus() ? 'AVAX' : this.tokenName
      if (this.actionType === "borrow") return tokenSymbol;
      if (this.actionType === "repay") return this.tokenPairName;

      return "XX";
    },
    pairValueTokenName() {
      const tokenSymbol = this.getAVAXStatus() ? 'AVAX' : this.tokenName
      if (this.actionType === "borrow") return this.tokenPairName;
      if (this.actionType === "repay") return tokenSymbol;

      return "XX";
    },
    pairValueDecimals() {
      if (this.actionType === "borrow") return this.tokenPairDecimals;
      if (this.actionType === "repay") return this.tokenDecimals;

      return 18;
    },
    mainValueDecimals() {
      if (this.actionType === "borrow") return this.tokenDecimals;
      if (this.actionType === "repay") return this.tokenPairDecimals;

      return 18;
    },
    parsedPairBalance() {
      return this.$ethers.utils.formatUnits(
        this.$store.getters.getBalancePairToken.toString(),
        this.tokenPairDecimals
      );
    },
    maxPairValue() {
      if (this.actionType === "borrow") {
        let valueInDolars;
        let maxPairValue;

        if (this.mainValue) {
          valueInDolars = this.mainValue / this.tokenToUsd;
          maxPairValue = (valueInDolars / 100) * (this.ltv - 1);
        } else {
          valueInDolars =
            this.$store.getters.getUserCollateralShare / this.tokenToUsd;
          maxPairValue =
            (valueInDolars / 100) * (this.ltv - 1) -
            this.$store.getters.getUserBorrowPart;
        }

        return maxPairValue;
      }

      if (this.actionType === "repay") {
        const maxAmount = parseFloat(+this.$store.getters.getUserCollateralShare).toFixed(20);
        // .toLocaleString(
        //   "fullwide",
        //   {
        //     maximumFractionDigits: this.pairValueDecimals,
        //   }
        // );
        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (this.pairValueDecimals || -1) + `})?`
        );
        return maxAmount.toString().match(re)[0];
      }

      return 0;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    actionBtnText() {
      if (this.mainValueError || this.pairValueError) return "Nothing to do";

      if (this.actionType === "borrow") {
        if (this.mainValue && this.pairValue && parseFloat(this.pairValue) > 0)
          return "Add collateral and borrow";

        if (this.mainValue) return "Add collateral";

        if (this.pairValue) return "Borrow";
      }

      if (this.actionType === "repay") {
        if (this.mainValue && this.pairValue && parseFloat(this.pairValue) > 0)
          return "Remove collateral and repay";

        if (this.mainValue) return "Repay";

        if (this.pairValue) return "Remove collateral";
      }

      return "Nothing to do";
    },
    liquidationPrice() {
      // if (this.pairValue) {
      //   let percent = parseFloat(
      //     (this.pairValue / this.maxPairValue) * 100
      //   ).toFixed(4);

      //   return ((1 / this.tokenToUsd / 100) * percent).toFixed(2);
      // }

      if (!this.percentValue) return "xxx.xx";

      if (!this.mainValue && this.pairValue) {
        const liquidationPrice =
          (((+this.$store.getters.getUserBorrowPart + +this.pairValue) * this.tokenToUsd) /
            +this.$store.getters.getUserCollateralShare) *
          (1 / this.tokenToUsd) *
          this.liquidationMultiplier;

        return liquidationPrice.toFixed(2);
      }

      if (this.mainValue && this.pairValue) {
        const liquidationPrice =
          ((+this.pairValue * this.tokenToUsd) / +this.mainValue) *
            (1 / this.tokenToUsd) *
            this.liquidationMultiplier || 0;

        return liquidationPrice.toFixed(2);
      }

      // return ((1 / this.tokenToUsd / 100) * this.percentValue).toFixed(2);

      return "xxx.xx";
    },
  },
  methods: {
    getAVAXStatus() {
      return this.$store.getters.getUseAVAX;
    },
    updateMultiplier(newVal) {
      this.multiplier = newVal;
    },
    updateSlipage(newVal) {
      this.slipage = newVal;
    },
    toggleUpdatePrice() {
      this.updatePrice = !this.updatePrice;
    },
    toggleShowLeverage() {
      if (this.showLeverage === true) {
        this.multiplier = 1;
      }

      this.showLeverage = !this.showLeverage;
    },
    toggleUseAVAX() {
      const AVAXStatus = this.$store.getters.getUseAVAX;
      this.$store.commit("setUseAVAX", !AVAXStatus);
    },
    toFixed(num, fixed) {
      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (fixed || -1) + `})?`);
      return num.toString().match(re)[0];
    },
    actionHandler() {
      if (this.mainValue && this.pairValue && parseFloat(this.pairValue) > 0) {
        if (this.actionType === "borrow") {
          const parsedAmount = this.$ethers.utils.parseUnits(
            this.mainValue.toString(),
            this.mainValueDecimals
          );

          const parsedPair = this.$ethers.utils.parseUnits(
            this.toFixed(this.pairValue, 6),
            this.pairValueDecimals
          );

          const payload = {
            collateralAmount: parsedAmount,
            amount: parsedPair,
            updatePrice: this.updatePrice,
          };

          if (this.multiplier > 1) {
            payload.amount = this.toFixed(this.pairValue, 6);
            this.multiplierHandle(payload, "addAndBorrowMultiple");
            return false;
          }

          this.$emit("addAndBorrow", payload);
        }

        if (this.actionType === "repay") {
          console.log(
            "here",
            this.toFixed(this.mainValue, 6),
            this.pairValue.toString()
          );

          let parsedAmount = this.$ethers.utils.parseUnits(
            this.toFixed(this.mainValue, 6),
            this.mainValueDecimals
          );
          let parsedPair = this.$ethers.utils.parseUnits(
            this.pairValue.toString(),
            this.pairValueDecimals
          );

          console.log("here", parsedAmount, parsedPair);

          let payload = {
            collateralAmount: parsedAmount,
            amount: parsedPair,
            updatePrice: this.updatePrice,
          };

          if (
            this.mainValue === this.maxMainValue &&
            this.pairValue === this.maxPairValue
          ) {
            parsedAmount = this.$ethers.utils.parseUnits(
              this.userTotalBorrowed,
              this.mainValueDecimals
            );
            parsedPair = this.$ethers.utils.parseUnits(
              this.userTotalCollateral,
              this.pairValueDecimals
            );

            payload = {
              collateralAmount: parsedAmount,
              amount: parsedPair,
              updatePrice: this.updatePrice,
            };

            console.log("its Max");
            this.$emit("removeAndRepayMax", payload);
            return false;
          }

          this.$emit("removeAndRepay", payload);
        }
        return false;
      }

      if (this.mainValue) {
        if (this.actionType === "borrow") {
          const parsedAmount = this.$ethers.utils.parseUnits(
            this.mainValue.toString(),
            this.mainValueDecimals
          );

          const payload = {
            amount: parsedAmount,
            updatePrice: this.updatePrice,
          };
          this.$emit("addCollateral", payload);
        }
        if (this.actionType === "repay") {
          const parsedAmount = this.$ethers.utils.parseUnits(
            this.toFixed(this.mainValue, 6),
            this.mainValueDecimals
          );

          const payload = {
            amount: parsedAmount,
            updatePrice: this.updatePrice,
          };
          this.$emit("repay", payload);
        }
        return false;
      }

      if (this.pairValue) {
        if (this.actionType === "borrow") {
          const parsedPair = this.$ethers.utils.parseUnits(
            this.toFixed(this.pairValue, 6),
            this.pairValueDecimals
          );

          const payload = {
            amount: parsedPair,
            updatePrice: this.updatePrice,
          };

          if (this.multiplier > 1) {
            payload.amount = this.toFixed(this.pairValue, 6);
            this.multiplierHandle(payload, "borrowMultiple");
            return false;
          }

          this.$emit("borrow", payload);
        }
        if (this.actionType === "repay") {
          const parsedPair = this.$ethers.utils.parseUnits(
            this.pairValue.toString(),
            this.pairValueDecimals
          );

          const payload = {
            amount: parsedPair,
            updatePrice: this.updatePrice,
          };

          this.$emit("removeCollateral", payload);
        }

        return false;
      }
    },
    multiplierHandle(data, type) {
      const percentValue = parseFloat(this.percentValue);

      if (!percentValue) return false;

      console.log("percentValue", percentValue);
      console.log("DATA", data);

      const slipageMutiplier = (100 - this.slipage) / 100;

      console.log("slipageMutiplier", slipageMutiplier);

      const amountMultiplyer = percentValue / 100;

      let startAmount = data.amount * 0.995;
      let finalAmount = 0;

      for (let i = this.multiplier; i > 0; i--) {
        finalAmount += +startAmount;
        startAmount = startAmount * amountMultiplyer;
      }

      const mimAmount = this.$ethers.utils.parseUnits(
        this.toFixed(finalAmount, this.pairValueDecimals),
        this.pairValueDecimals
      );

      const minValue = finalAmount * this.tokenToUsd * slipageMutiplier;

      const minValueParsed = this.$ethers.utils.parseUnits(
        this.toFixed(minValue, this.mainValueDecimals),
        this.mainValueDecimals
      );

      console.log("finalAmount", finalAmount);
      console.log("minValue", minValue);

      const payload = {
        ...data,
        amount: mimAmount,
        minExpected: minValueParsed,
      };

      console.log("AMOUNT AFTER", type, mimAmount.toString());

      this.$emit(type, payload);
    },
    clearData() {
      this.mainValue = "";
      this.mainValueError = "";
      this.pairValue = "";
      this.pairValueError = "";
      this.percentValue = "";
    },
    updateMainValue(value) {
      console.log("updateMain", value);
      this.mainValue = value;

      if (parseFloat(value) > parseFloat(this.maxMainValue)) {
        this.mainValueError = `The value cannot be greater than ${this.maxMainValue}`;
        return false;
      }

      this.mainValueError = "";

      if (this.actionType === "repay") {
        const collateralPercent = (this.pairValue / this.maxPairValue) * 100;
        const borrowPercent = (value / this.userTotalBorrowed) * 100;

        const borrowedInDolarts = this.userTotalBorrowed / this.tokenPairToUsd;
        const collateralInDolarts = this.userTotalCollateral / this.tokenToUsd;
        const userHasDolars = collateralInDolarts - borrowedInDolarts;
        const acceptedPercent = (userHasDolars / collateralInDolarts) * 100;

        // console.log(collateralPercent, borrowPercent, acceptedPercent);
        if (
          collateralPercent <= borrowPercent &&
          collateralPercent < acceptedPercent
        ) {
          this.pairValueError = "";
          return false;
        }
        this.pairValueError = `You have insufficient collateral. Please enter a smaller amount or repay more.`;
        return false;
      }

      if (this.pairValue) {
        this.updatePairValue(this.pairValue);
      }

      if (this.percentValue && value) {
        this.pairValue = (this.maxPairValue * this.percentValue) / this.ltv;
      }
    },
    updatePairValue(value) {
      if (parseFloat(value) > parseFloat(this.maxPairValue)) {
        this.pairValueError = `The value cannot be greater than ${this.maxPairValue}`;
        return false;
      }

      if (this.actionType === "repay") {
        if (!value) {
          this.pairValueError = "";
          this.pairValue = value;
        }

        const borrowedInDolarts = this.userTotalBorrowed / this.tokenPairToUsd;
        const collateralInDolarts = this.userTotalCollateral / this.tokenToUsd;
        const userHasDolars = collateralInDolarts - borrowedInDolarts;
        const acceptedPercent = (userHasDolars / collateralInDolarts) * 100;

        // console.log(
        //   borrowedInDolarts,
        //   collateralInDolarts,
        //   userHasDolars,
        //   acceptedPercent
        // );

        const collateralPercent = (value / this.maxPairValue) * 100;
        const borrowPercent = (this.mainValue / this.userTotalBorrowed) * 100;

        if (
          acceptedPercent < collateralPercent &&
          collateralPercent > borrowPercent
        ) {
          this.pairValueError = `You have insufficient collateral. Please enter a smaller amount or repay more.`;
          this.pairValue = value;
          return false;
        }

        console.log(collateralPercent, borrowPercent);
        this.pairValueError = "";
        this.pairValue = value;

        return false;
      }

      this.pairValueError = "";
      this.pairValue = value;

      if (!value) {
        this.updatePercentValue("");
        return false;
      }

      this.updatePercentValue(
        parseFloat((this.pairValue / this.maxPairValue) * this.ltv).toFixed(4),
        true
      );
    },
    updatePercentValue(value, fromPair) {
      this.percentValue = value;

      if (fromPair) return false;

      if (this.mainValue && value) {
        this.pairValue = (this.maxPairValue * value) / this.ltv;
      }
    },
    async getUserBalance() {
      // const balance = await this.signer.getBalance();

      // const parsedBalance = this.$ethers.utils.formatUnits(balance.toString());

      const parsedBalance = this.$ethers.utils.formatUnits(
        this.balance.toString(),
        this.tokenDecimals
      );

      const parsedBalanceNativeToken = this.$ethers.utils.formatEther(
        this.balanceNativeToken.toString()
      );

      this.userBalance = parsedBalance;
      this.userBalanceNativeToken = parsedBalanceNativeToken;

      console.log("FORMAT BALANCE:", this.userBalance);
      console.log("FORMAT BALANCE NATIVE TOKEN:", this.userBalanceNativeToken);
    },
  },
  async created() {
    await this.getUserBalance();
  },
  components: {
    ValueInput,
    LiquidationRules,
    LeverageBar,
    SlipageBlock,
  },
};
</script>

<style scoped lang="scss">
.deposit-borrow-block {
  padding: 30px 20px;
  background: $clrBg2;
  border-radius: 20px;
  width: 100%;

  .config-box {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .checkbox-wrap {
    display: flex;
    align-items: center;

    .label-text {
      cursor: pointer;
    }

    .info-icon {
      width: 16px;
      height: 16px;
      margin-left: 5px;
    }

    .box-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      border-radius: 8px;
      border: 1px solid #57507a;
      background: rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: all 0.1s ease;

      &:hover {
        border: 1px solid $clrBlue;
      }

      &.active {
        border: 1px solid $clrBlue;

        .box {
          opacity: 1;
        }
      }

      .box {
        background: $clrBlue;
        border-radius: 4px;
        width: 12px;
        height: 12px;
        opacity: 0;
        transition: all 0.1s ease;
      }
    }
  }

  .action-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h3 {
    margin-bottom: 15px;
    text-align: left;
    text-transform: uppercase;
  }

  .input-wrap {
    margin: 20px 0;
  }

  .action-btn {
    margin-left: auto;
    width: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
}

@media screen and(max-width: 780px) {
  .deposit-borrow-block {
    padding-left: 10px;
    padding-right: 10px;
  }

  .deposit-borrow-block .config-box {
    padding: 10px;
  }
}
</style>
