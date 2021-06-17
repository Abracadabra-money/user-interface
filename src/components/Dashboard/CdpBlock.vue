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
  background: #221b47;
  border-radius: 20px;
  padding: 20px 10px 15px;
  min-height: 300px;
  position: relative;

  h2 {
    margin-bottom: 25px;
    text-align: center;
  }
}

@media screen and(max-width: 1024px) {
  .cdp-block {
    min-height: 150px;
  }
}
</style>
