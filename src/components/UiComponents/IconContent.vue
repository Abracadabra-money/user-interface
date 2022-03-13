<template>
  <img :src="icon">
</template>

<script>
export default {
  name: "IconContent",
  props: {
    icon: {
      type: String,
    }
  }
};
</script>

<style scoped>

</style>