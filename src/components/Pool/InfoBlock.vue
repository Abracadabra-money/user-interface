<template>
  <div class="info-block">
    <div class="items-wrap">
      <CollParamItem v-for="(item, idx) in infoItems" :key="idx" :item="item" />
    </div>
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
  },
  components: {
    CollParamItem,
  },
};
</script>

<style scoped lang="scss">
.info-block {
  padding: 30px 20px;
  background: $clrBg2;
  border-radius: 20px;

  .items-wrap {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 5px;
  }
}

@media screen and(max-width: 780px) {
  .info-block {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
