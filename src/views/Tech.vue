<template>
  <div class="tech-view" :style="{ backgroundImage: `url(${mainBgGrid})` }">
    <img src="@/assets/images/tech/ellipse-1.svg" alt="" class="bg-ellipse-1" />
    <img src="@/assets/images/tech/ellipse-2.svg" alt="" class="bg-ellipse-2" />

    <div class="container mini">
      <h1>Technicals</h1>

      <div class="tech-sect">
        <img src="@/assets/images/tech/coins-1.svg" alt="" class="bg-coins-1" />
        <img src="@/assets/images/tech/coins-2.svg" alt="" class="bg-coins-2" />

        <div class="inner-wrap">
          <img src="@/assets/images/tech/heart.svg" alt="" class="heart-img" />

          <h3 class="title">ORACLES</h3>

          <p>
            Abracadabra Money uses ibTKN to open CDPs that reference the USD
            value of these ibTKNS. As a result, reliable price feed for these
            ibTKNs are required.
          </p>

          <h3 class="title">Abracadabra Money uses the following Oracles.</h3>

          <p>BLAHHABLAHBLAHBBL</p>

          <h3 class="title">CONTRACTs</h3>

          <p>
            Here is a link to the github where you will find all relevant
            contracts.
          </p>

          <p>Liquidations Details</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mainBgGrid from "@/assets/images/main-grid.svg";
export default {
  data() {
    return {
      mainBgGrid,
    };
  },
};
</script>

<style lang="scss" scoped>
.tech-view {
  background-repeat: repeat;
  background-position: center;
  padding-top: $headerHeight + 85px;
  padding-bottom: $footerHeight + 160px;
  position: relative;
  overflow: hidden;

  .bg-ellipse-1 {
    position: absolute;
    top: 0;
    left: 0;
  }

  .bg-ellipse-2 {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  h1 {
    margin-bottom: 40px;
  }

  .title {
    font-size: 26px;
    color: #9695f8;
    margin-bottom: 20px;
    margin-top: 20px;
    text-align: left;
    max-width: 720px;
    text-align: center;
  }

  p {
    font-size: 20px;
    line-height: 1.5;
    padding-bottom: 20px;
    text-align: left;
    text-align: center;
    max-width: 720px;
  }

  .tech-sect {
    position: relative;

    .bg-coins-1 {
      position: absolute;
      top: -50px;
      left: -55px;
      width: 108px;
      height: auto;
    }

    .bg-coins-2 {
      position: absolute;
      bottom: -70px;
      right: -60px;
      width: 108px;
      height: auto;
    }

    .inner-wrap {
      background: #1d173e;
      border-radius: 20px;
      padding: 70px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .heart-img {
      width: 120px;
      height: auto;
      margin-bottom: 30px;
    }
  }
}

@media screen and(max-width: 1280px) {
  .tech-view .title {
    font-size: 24px;
  }

  .tech-view p {
    font-size: 18px;
  }
}
</style>
