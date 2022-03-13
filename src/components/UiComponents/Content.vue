<template>
  <p>{{text}}</p>
</template>

<script>
export default {
  name: "Content",
  props: {
    text: {
      type: String,
    }
  },
};
</script>

<style scoped>

</style>