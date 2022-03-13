<template>
  <div class="action-group">
    <p class="connect-wallet-text">
      {{text}}
    </p>
    <button
      class="connect-btn"
      @click="onClick"
    >
      {{name}}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    name: {
      type: String,
    },
    onClick: {
      type: Function,
    },
  },
};
</script>
<style scoped lang="scss">
.action-group {
  padding: 350px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.connect-wallet-text {
  font-family: 'Work Sans', sans-serif;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  color: #FFFFFF;
}
.connect-btn {
  font-size: 14px;
  margin-top: 40px;
  align-items: center;
  padding: 8px 31px;
  width: 120px;
  background: #E7FC6E;
  border-radius: 21px;
  cursor: pointer;
}
</style>