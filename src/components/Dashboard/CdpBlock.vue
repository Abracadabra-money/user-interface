<template>
  <div class="cdp-block">
    <h2>Opened deals</h2>

    <div class="items-wrap" v-if="pools.length">
      <CdpItem v-for="pool in pools" :pool="pool" :key="pool.id" />
    </div>
    <p v-else>You have no opened deals yet</p>
  </div>
</template>

<script>
const CdpItem = () => import("@/components/Dashboard/CdpItem");
export default {
  props: {
    pools: {
      type: Array,
    },
  },
  components: {
    CdpItem,
  },
};
</script>

<style lang="scss" scoped>
.cdp-block {
  background: $clrBg1;
  border-radius: 4px;
  padding: 33px 24px;
  min-height: 252px;
  position: relative;

  h2 {
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 42px;
    text-align: left;
  }

  p {
    color: $clrDisableText;
    text-align: left;
  }
}

@media screen and(max-width: 1024px) {
  .cdp-block {
    min-height: 150px;
  }
}
</style>
