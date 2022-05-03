<template>
  <div class="main-banner" :class="{ 'mt-header': isHeaderAbsolute }">
    <img src="@/assets/images/banner/left-img.svg" alt="" class="left-img" />
    <img src="@/assets/images/banner/right-img.svg" alt="" class="right-img" />

    <div class="container">
      <img
        src="@/assets/images/banner/pixel-star.svg"
        alt=""
        class="star-left"
      />
      <img
        src="@/assets/images/banner/pixel-circle.svg"
        alt=""
        class="circle-left"
      />

      <img
        src="@/assets/images/banner/pixel-star.svg"
        alt=""
        class="star-right"
      />
      <img
        src="@/assets/images/banner/pixel-circle.svg"
        alt=""
        class="circle-right"
      />
      <img
        src="@/assets/images/close-popup.svg"
        alt=""
        class="close-img"
        @click="closeBanner"
      />
      <div class="text-wrap">
        <h3>
          Metamask currently does not support signatures using Ledger/Trezor
          devices
        </h3>
        <div class="sub-wrap">
          <img src="@/assets/images/Pixel_time.svg" alt="" class="clock-img" />
          <p>
            We are monitoring the situation and will implement a fix as soon as
            its available
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isHeaderAbsolute() {
      const pages = ["Docs", "Tech", "Liquidations"];

      return pages.indexOf(this.$route.name) !== -1;
    },
  },
  methods: {
    closeBanner() {
      this.$store.commit("closeBanner");
    },
  },
};
</script>

<style lang="scss" scoped>
.main-banner {
  width: 100%;
  background-color: $clrBlue;
  z-index: 200;
  position: relative;

  .star-left {
    position: absolute;
    top: 20px;
    left: 10%;
    width: 15px;
    height: 15px;
  }

  .star-right {
    position: absolute;
    top: 10px;
    right: 13%;
    width: 15px;
    height: 15px;
  }

  .circle-left {
    position: absolute;
    left: 16%;
    bottom: 10px;
    width: 20px;
    height: 20px;
  }

  .circle-right {
    position: absolute;
    right: 8%;
    bottom: 20px;
    width: 20px;
    height: 20px;
  }

  .left-img {
    width: 75px;
    height: auto;
    position: absolute;
    left: 2%;
    top: 0;
  }

  .right-img {
    width: 75px;
    height: auto;
    position: absolute;
    right: 2%;
    bottom: 0;
  }

  &.mt-header {
    margin-top: $headerHeight;
  }

  .close-img {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 2%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: transform 0.3s ease;
    z-index: 20;

    &:hover {
      transform: translateY(-50%) scale(1.1);
    }
  }

  .container {
    height: 60px;
    position: relative;
    padding-top: 10px;
    padding-bottom: 7px;
  }

  h3 {
    font-weight: bold;
    font-size: 16px;
    line-height: 1.3;
    text-align: center;
    max-width: 90%;
  }

  .sub-wrap {
    display: flex;
    align-items: center;
    max-width: 90%;

    p {
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
      color: $clrYellow;
    }

    .clock-img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      margin-right: 10px;
    }
  }

  .text-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: uppercase;
    position: relative;
    text-align: center;
  }
}

@media screen and(max-width: 1080px) {
  .main-banner .container {
    height: auto;
  }

  .main-banner h3 {
    font-size: 14px;
  }

  .main-banner .sub-wrap .clock-img {
    width: 16px;
    height: 16px;
  }

  .main-banner .star-left,
  .main-banner .star-right,
  .main-banner .circle-left,
  .main-banner .circle-right {
    display: none;
  }
}
</style>
