<template>
  <div
    class="popup"
    v-if="isOpen"
    @click="$emit('close')"
  >
    <div class="popup-window" @click.stop="">
      <img
        src="@/assets/images/close-popup.svg"
        alt=""
        class="close-btn"
        @click="$emit('close')"
      />
      <p class="popup-title">{{title}}</p>
      <div class="popup-body">
        <slot class="popup-slot"></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Popup",
  props: {
    title: {
      type: String,
    },
    isOpen: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 19, 0.6);
  z-index: 10000;
}

.popup-window {
  margin: 0 auto;
  width: 500px;
  height: auto;
  display: flex;
  flex-direction: column;
  background: #262626;
  border-radius: 8px;
  padding-bottom: 40px;
}

.popup-title {
  font-family: 'Work Sans', sans-serif;
  font-weight: 400;
  font-size: 20px;
  text-align: center;
  color: #FFFFFF;
  margin-top: 6px;
  margin-bottom: 29px;
}

.close-btn {
  height: 14px;
  cursor: pointer;
  margin: 21px 21px 0 auto;
  justify-content: space-between;
}

.popup-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 75px;
}
</style>
