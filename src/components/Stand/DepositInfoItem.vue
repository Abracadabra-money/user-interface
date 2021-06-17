<template>
  <div class="deposited-item">
    <div class="title-wrap">
      <p class="title">{{ title }}</p>

      <a
        v-if="dataObj.link"
        class="swap-link"
        :href="dataObj.link"
        target="_blank"
      >
        {{ dataObj.tokenType || dataObj.tokenName }}
        <img src="@/assets/images/icons8-external-link.svg" alt=""
      /></a>
    </div>

    <p class="subtitle">ERC-20</p>

    <div class="inform-item">
      <div class="value-type">
        <TokenIcon :token="dataObj.tokenName" />
        <p>{{ dataObj.tokenName.toUpperCase() }}</p>
      </div>
      <div class="amounts-wrap">
        <p class="main-amount">{{ dataObj.mainValue }}</p>
        <p class="usd-amount">$ {{ dataObj.usdValue }}</p>
      </div>
    </div>

    <button
      class="btn mini"
      :disabled="!dataObj.mainValue || dataObj.mainValue == 0"
      @click="clickHandler"
      v-tooltip="tooltipText"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/UiComponents/TokenIcon");

export default {
  props: {
    dataObj: {
      type: Object,
      required: true,
    },
  },
  computed: {
    title() {
      if (this.dataObj.type === "deposit")
        return `${this.dataObj.tokenType} Deposited`;

      if (this.dataObj.type === "earned") return "Earned";

      return "Title";
    },
    buttonText() {
      if (this.dataObj.type === "deposit") return "Withdraw";

      if (this.dataObj.type === "earned") return "Harvest";

      return "Action";
    },
    tooltipText() {
      if (this.dataObj.type === "deposit")
        return `Withdrawal will take out your ${this.dataObj.tokenType} from the pool along with earned Spell tokens.`;

      if (this.dataObj.type === "earned")
        return "This will withdraw only your earned spell.";

      return "";
    },
  },
  methods: {
    clickHandler() {
      this.$emit("click", this.dataObj.type);
    },
  },
  components: {
    TokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.deposited-item {
  width: calc(50% - 10px);
  background: $clrBlue3;
  border-radius: 12px;
  padding: 20px;

  .title-wrap {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .swap-link {
    display: flex;
    align-items: center;
    line-height: 1;
    opacity: 0.7;
    text-decoration: none;
    color: #fff;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
    img {
      width: 20px;
      height: 20px;
      min-width: 20px;
      min-height: 20px;
      padding-bottom: 1px;
    }
  }

  .btn {
    background: rgba(255, 255, 255, 0.1);
    margin-left: auto;
    width: 120px;

    &:disabled {
      background-color: #48485c;
      opacity: 0.6;
    }
  }

  .title {
    text-transform: uppercase;
    font-size: 20px;
    text-align: left;
    margin-bottom: 5px;
    display: block;
    color: #fff;
    text-decoration: none;
  }

  a.title {
    &:hover {
      text-decoration: underline;
    }
  }

  .subtitle {
    text-transform: uppercase;
    font-size: 14px;
    text-align: left;
  }

  .inform-item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    background: rgba(34, 27, 71, 0.4);
    border-radius: 8px;
    padding: 15px 20px;
    margin-top: 10px;
    margin-bottom: 20px;

    .amounts-wrap {
      text-align: right;

      .main-amount {
        font-size: 24px;
        margin-bottom: 5px;
      }

      .usd-amount {
        font-size: 14px;
      }
    }

    .value-type {
      display: flex;
      align-items: center;
      justify-content: center;

      .type-icon {
        width: 32px;
        height: 32px;
        object-fit: contain;
        margin-right: 10px;
      }
    }
  }
}

@media screen and(max-width: 780px) {
  .deposited-item {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
