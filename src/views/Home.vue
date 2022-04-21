<!--<template>-->
<!--  <div class="home-view" :style="{ backgroundImage: `url(${mainBgGrid})` }">-->
<!--    <section class="section-1">-->
<!--      <div class="info-block">-->
<!--        <img class="bg-cloud" src="@/assets/images/cloud-1.svg" alt="" />-->
<!--        <div class="text-wrap">-->
<!--          <h1>Abracadabra.Money is a spell book</h1>-->
<!--          <p class="blue-text">-->
<!--            that allows users to produce Magic Internet Money.-->
<!--          </p>-->

<!--          <div class="subtext-wrap">-->
<!--            <p class="regular-text">-->
<!--              You, the Spellcaster, can provide collateral in the form of-->
<!--              various interest bearing crypto assets such as yvYFI, yvUSDT,-->
<!--              yvUSDC, xSUSHI and more.-->
<!--            </p>-->

<!--            <div class="regular-text">-->
<!--              With this, you can borrow magic internet money (MIM) which is a-->
<!--              stable coin that you can swap for any other traditional stable-->
<!--              coin.-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <img class="sect-image" src="@/assets/images/home-get-coins.svg" alt="" />-->
<!--    </section>-->

<!--    <section class="section-2">-->
<!--      <div class="info-block">-->
<!--        <img class="bg-cloud" src="@/assets/images/cloud-2.svg" alt="" />-->
<!--        <div class="text-wrap">-->
<!--          &lt;!&ndash; <p class="regular-text">-->
<!--            These components are used to magically conjure stable coins pegged-->
<!--            to fiat currencies, such as USD-->
<!--          </p> &ndash;&gt;-->
<!--          <p class="blue-text">-->
<!--            THE FORMULA IS STRAIGHT FORWARD. COLLATERAL IN - POOF - STABLE COIN-->
<!--            OUT.-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->
<!--      <img-->
<!--        class="sect-image"-->
<!--        src="@/assets/images/home-defeat-the-dragon.svg"-->
<!--        alt=""-->
<!--      />-->
<!--    </section>-->

<!--    <section class="section-3">-->
<!--      <div class="info-block">-->
<!--        <img class="bg-cloud" src="@/assets/images/cloud-3.svg" alt="" />-->
<!--        <div class="text-wrap">-->
<!--          <h1>-->
<!--            TO REVERSE THE SPELL, THE CASTER SIMPLY RETURNS THE CONJURED MIMS TO-->
<!--            THE SPELL BOOK. THEN THE MAGICALLY LOCKED INTEREST BEARING TOKENS-->
<!--            ARE RELEASED.-->
<!--          </h1>-->
<!--        </div>-->
<!--      </div>-->
<!--      <img class="sect-image" src="@/assets/images/home-win.svg" alt="" />-->
<!--    </section>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import mainBgGrid from "@/assets/images/main-grid.svg";-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      mainBgGrid,-->
<!--    };-->
<!--  },-->
<!--  name: "Home",-->
<!--};-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.home-view {-->
<!--  background-repeat: repeat;-->
<!--  background-position: center;-->
<!--  padding-top: $headerHeight + 40px;-->
<!--  padding-bottom: $footerHeight + 145px;-->

<!--  .section-1,-->
<!--  .section-2,-->
<!--  .section-3 {-->
<!--    max-width: 1440px;-->
<!--    margin-left: auto;-->
<!--    margin-right: auto;-->
<!--  }-->

<!--  .blue-text {-->
<!--    font-style: normal;-->
<!--    font-weight: normal;-->
<!--    font-size: 24px;-->
<!--    line-height: 1.2;-->
<!--    text-transform: uppercase;-->
<!--    color: $clrBlue;-->
<!--  }-->

<!--  .regular-text {-->
<!--    font-style: normal;-->
<!--    font-weight: normal;-->
<!--    font-size: 16px;-->
<!--    line-height: 1.2;-->
<!--    text-align: center;-->
<!--    letter-spacing: 0.1em;-->
<!--    color: $clrText;-->
<!--    padding-bottom: 5px;-->
<!--  }-->

<!--  .sect-image {-->
<!--    width: 100%;-->
<!--    height: auto;-->
<!--    z-index: 1;-->
<!--    position: relative;-->
<!--  }-->

<!--  .bg-cloud {-->
<!--    position: absolute;-->
<!--    top: 50%;-->
<!--    left: 50%;-->
<!--    width: 100%;-->
<!--    height: auto;-->
<!--    transform: translateX(-50%) translateY(-50%);-->
<!--  }-->

<!--  .section-1 {-->
<!--    .sect-image {-->
<!--      margin-top: -150px;-->
<!--    }-->

<!--    .blue-text {-->
<!--      font-size: 20px;-->
<!--      margin-bottom: 5px;-->
<!--    }-->

<!--    .info-block {-->
<!--      padding: 145px 105px;-->
<!--      margin: 0 auto;-->
<!--      width: max-content;-->
<!--      position: relative;-->

<!--      .text-wrap {-->
<!--        z-index: 2;-->
<!--        position: relative;-->
<!--        max-width: 530px;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .section-2 {-->
<!--    margin-top: 15px;-->

<!--    .sect-image {-->
<!--      margin-top: -260px;-->
<!--    }-->

<!--    .blue-text {-->
<!--      margin-top: 14px;-->
<!--    }-->

<!--    .info-block {-->
<!--      padding: 125px 80px 110px 60px;-->
<!--      margin: 0 12% 0 auto;-->
<!--      width: max-content;-->
<!--      position: relative;-->

<!--      .text-wrap {-->
<!--        z-index: 2;-->
<!--        position: relative;-->
<!--        max-width: 460px;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .section-3 {-->
<!--    .sect-image {-->
<!--      margin-top: -60px;-->
<!--    }-->

<!--    .info-block {-->
<!--      padding: 125px 15px;-->
<!--      margin: 0 auto;-->
<!--      width: max-content;-->
<!--      position: relative;-->

<!--      .text-wrap {-->
<!--        z-index: 2;-->
<!--        position: relative;-->
<!--        max-width: 640px;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--@media screen and(max-width: 980px) {-->
<!--  .home-view .section-2 .info-block {-->
<!--    margin: 0 auto;-->
<!--  }-->

<!--  .home-view .section-2 .sect-image {-->
<!--    margin-top: -100px;-->
<!--  }-->
<!--}-->

<!--@media screen and(max-width: 780px) {-->
<!--  .home-view .bg-cloud {-->
<!--    display: none;-->
<!--  }-->

<!--  .home-view .section-1,-->
<!--  .home-view .section-2,-->
<!--  .home-view .section-3 {-->
<!--    width: 100%;-->
<!--    padding-left: 15px;-->
<!--    padding-right: 15px;-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    align-items: center;-->
<!--    overflow: hidden;-->
<!--  }-->

<!--  .home-view .section-1 .info-block,-->
<!--  .home-view .section-2 .info-block,-->
<!--  .home-view .section-3 .info-block {-->
<!--    width: 100%;-->
<!--    padding: 0;-->
<!--    margin-bottom: 30px;-->
<!--  }-->

<!--  .home-view .section-1 .sect-image,-->
<!--  .home-view .section-2 .sect-image,-->
<!--  .home-view .section-3 .sect-image {-->
<!--    margin-top: 0;-->
<!--    margin-bottom: 100px;-->
<!--  }-->

<!--  .home-view .section-1 .info-block .text-wrap,-->
<!--  .home-view .section-2 .info-block .text-wrap,-->
<!--  .home-view .section-3 .info-block .text-wrap {-->
<!--    width: 100%;-->
<!--    max-width: 640px;-->
<!--    margin-left: auto;-->
<!--    margin-right: auto;-->
<!--  }-->
<!--}-->

<!--@media screen and(max-width: 480px) {-->
<!--  .home-view .section-1 .sect-image {-->
<!--    width: 400px;-->
<!--  }-->

<!--  .home-view .section-2 .sect-image {-->
<!--    width: 500px;-->
<!--  }-->

<!--  .home-view .section-3 .sect-image {-->
<!--    width: 500px;-->
<!--    margin-bottom: 0;-->
<!--  }-->
<!--}-->
<!--</style>-->
