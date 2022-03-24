<template>
  <div class="coll-params-block">
    <h2>My Open Position</h2>

    <div class="items-wrap">
      <CollParamItem v-for="(item, idx) in getInfoItems" :key="idx" :item="item" />
    </div>

    <p class="btm-text">1 nUSD = 1 USD</p>
    <p class="btm-text">1 {{ tokenName }} = {{ tokentToNUSD }} nUSD</p>
  </div>
</template>

<script>
const CollParamItem = () => import("@/components/Pool/CollParamItem");
export default {
  props: {
    infoItems: {
      type: Array,
      required: true,
    },
    exchangeRate: {
      required: true,
    },
    tokenName: {
      type: String,
      required: true,
    },
  },
  computed: {
    tokentToNUSD() {
      const tokenToNUSD = 1 / this.exchangeRate;

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`);
      return tokenToNUSD.toString().match(re)[0];
    },
    getInfoItems() {
      return this.infoItems;
    },
  },
  components: {
    CollParamItem,
  },
};
</script>

<style scoped lang="scss">
.coll-params-block {
  background: $clrBg2;
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  .btm-text,
  h2 {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 16px;
  }

  h2 {
    padding: 16px 24px;
    border-bottom: 1px solid #1C1C1C;
  }

  .items-wrap {
    flex: 1;
    max-height: 380px;
    overflow-y: auto;
    padding-right: 5px;
    margin-bottom: auto;
  }
}

@media screen and(max-width: 780px) {
  .coll-params-block {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
