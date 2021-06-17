<template>
  <div class="swap-popup">
    <img
      src="@/assets/images/close-popup.svg"
      alt=""
      class="close-btn"
      @click="closePopup"
    />

    <p class="title">Swap</p>

    <p class="balance-text" v-if="swapObject">
      Balance: {{ parseFloat(activeFromToken.balance).toFixed(4) }}
    </p>

    <template v-if="swapObject">
      <div class="target-row">
        <p class="label-text">From</p>
        <ValueInput
          :max="activeFromToken.balance"
          :values="fromTokens"
          :valueName="activeFromToken.name"
          @changeToken="changeFromToken"
          @onchange="updateMainValue"
          :error="mainValueError"
          :parentValue="mainValue"
        />
      </div>

      <img src="@/assets/images/pixel-swipe.svg" alt="" class="swap-icon" />

      <div class="target-row to-row">
        <p class="label-text">To</p>
        <ValueInput
          :valueName="activeToToken.name"
          :values="toTokens"
          :parentValue="pairValue"
          :disabled="true"
          @changeToken="changeToToken"
        />
      </div>

      <button
        class="btn approve-btn"
        :disabled="!mainValue && mainValueError"
        @click="swapHandler"
      >
        Swap
      </button>
    </template>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UiComponents/ValueInput");
export default {
  data() {
    return {
      swapObject: null,
      activeFromTokenIdx: 0,
      activeToTokenIdx: 1,
      mainValue: "",
      mainValueError: "",
      pairValueError: "",
      virtualPrice: 0,
      updateInterval: null,
    };
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
    activeFromToken() {
      return this.swapObject.tokens.find(
        (token) => token.tokenIdx === this.activeFromTokenIdx
      );
    },
    activeToToken() {
      return this.swapObject.tokens.find(
        (token) => token.tokenIdx === this.activeToTokenIdx
      );
    },
    fromTokens() {
      return this.swapObject.tokens.filter(
        (token) => token.tokenIdx !== this.activeFromTokenIdx
      );
    },
    toTokens() {
      if (this.activeFromTokenIdx === 0) {
        return this.swapObject.tokens.filter(
          (token) =>
            token.tokenIdx !== 0 && token.tokenIdx !== this.activeToTokenIdx
        );
      }

      return [];
    },
    pairValue() {
      let value;

      if (this.activeFromTokenIdx === 0) {
        value = this.mainValue * this.activeToToken.rate;
      }
      if (this.activeFromTokenIdx !== 0) {
        value = this.mainValue / this.activeFromToken.rate;
      }
      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (this.activeToToken.decimals || -1) + `})?`
      );
      return value.toString().match(re)[0];
    },
  },
  methods: {
    toFixed(num, fixed) {
      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (fixed || -1) + `})?`);
      return num.toString().match(re)[0];
    },
    changeToToken(idx) {
      this.activeToTokenIdx = idx;
    },
    changeFromToken(idx) {
      this.mainValue = "";
      this.mainValueError = "";
      this.activeFromTokenIdx = idx;

      if (idx !== 0) {
        this.activeToTokenIdx = 0;
        return false;
      }

      if (idx === 0 && this.activeToTokenIdx === 0) {
        this.activeToTokenIdx = 1;
        return false;
      }
    },
    closePopup() {
      this.$emit("close");
    },
    updateMainValue(value) {
      if (value > this.activeFromToken.balance) {
        this.mainValueError = `The value cannot be greater than ${this.activeFromToken.balance}`;
        return false;
      }

      this.mainValueError = "";
      this.mainValue = value;
    },
    async swapHandler() {
      const hasMainAllowance = await this.checkTokenAllowance(
        this.activeFromToken
      );

      if (!hasMainAllowance) return false;

      try {
        const parsedAmount = this.$ethers.utils.parseUnits(
          this.mainValue.toString(),
          this.activeFromToken.decimals
        );

        const minAmount = this.toFixed(
          String(this.pairValue * 0.95),
          this.activeToToken.decimals
        );

        const minExpected = this.$ethers.utils.parseUnits(
          minAmount.toString(),
          this.activeToToken.decimals
        );

        const tx = await this.swapObject.contractInstance[
          "exchange_underlying(int128,int128,uint256,uint256)"
        ](
          this.activeFromTokenIdx,
          this.activeToTokenIdx,
          parsedAmount,
          minExpected,
          { gasLimit: 400000 }
        );

        this.closePopup();

        const receipt = await tx.wait();
        console.log(receipt);
      } catch (e) {
        console.log("swap err:", e);
      }
    },
    async updateTokens(swapObject = this.swapObject) {
      return await Promise.all(
        swapObject.tokens.map((token) => this.updateToken(token))
      );
    },
    async updateToken(token) {
      let balance;

      try {
        console.log("BALANCE OF: ", this.account);

        const userBalance = await token.contractInstance.balanceOf(
          this.account,
          {
            gasLimit: 600000,
          }
        );

        balance = this.$ethers.utils.formatUnits(
          userBalance.toString(),
          token.decimals
        );

        console.log("BALANCE", token.name, balance);
      } catch (e) {
        console.log("userBalance Err:", e);
      }

      return {
        ...token,
        balance,
      };
    },
    async getVirtualPrice(contract = this.swapObject.rateContract) {
      try {
        // const estimateGas = await contract.get_virtual_price();

        // const gasLimit = 1000 + +estimateGas.toString();

        const rate = await contract.get_virtual_price();

        const parsedRate = this.$ethers.utils.formatUnits(rate.toString(), 18);

        return parsedRate;
      } catch (e) {
        console.log("getVirtualPrice err:", e);
      }
    },
    async checkTokenAllowance(token) {
      try {
        if (!token.allowance) {
          const estimateGas = await token.contractInstance.approve(
            this.swapObject.contractInstance.address,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );

          const gasLimit = 1000 + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const tx = await token.contractInstance.approve(
            this.swapObject.contractInstance.address,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            { gasLimit }
          );

          const receipt = await tx.wait();
          console.log("ALLOWANCE RESP: ", receipt);
          return true;
        }

        return true;
      } catch (e) {
        console.log("checkAllowance", e);
        return false;
      }
    },
    async initPopup() {
      const swapObject = this.$store.getters.getSwapObject;

      if (!swapObject) {
        this.closePopup();
        return false;
      }

      const updatedTokens = await this.updateTokens(swapObject);
      this.virtualPrice = await this.getVirtualPrice(swapObject.rateContract);

      this.swapObject = {
        ...swapObject,
        tokens: updatedTokens,
      };
    },
  },
  async created() {
    await this.initPopup();

    this.updateInterval = setInterval(async () => {
      await this.initPopup();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.updateInterval);
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
