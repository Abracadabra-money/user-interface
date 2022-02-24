<!--<template>-->
<!--  <footer class="app-footer" :class="{ transparent: itsTransparent }">-->
<!--    <div class="container">-->
<!--      <div class="skulls-wrap">-->
<!--        <img src="@/assets/images/skulll.svg" alt="" class="skulls-img img-1" />-->
<!--        <img src="@/assets/images/skulll.svg" alt="" class="skulls-img img-2" />-->
<!--      </div>-->
<!--      <nav class="footer-nav">-->
<!--        &lt;!&ndash; <router-link :to="{ name: 'Docs' }" class="nav-link">Docs</router-link>-->
<!--        <router-link :to="{ name: 'Tech' }" class="nav-link">Tech</router-link> &ndash;&gt;-->
<!--        <router-link :to="{ name: 'Liquidations' }" class="nav-link"-->
<!--          >Liquidations</router-link-->
<!--        >-->
<!--      </nav>-->
<!--      <div class="links-wrap">-->
<!--        <a-->
<!--          target="_blank"-->
<!--          href="https://medium.com/abracadabra-money"-->
<!--          class="link-item"-->
<!--        >-->
<!--          <img src="@/assets/images/medium-pixel.svg" alt="" />-->
<!--        </a>-->
<!--        <a-->
<!--          target="_blank"-->
<!--          href="https://twitter.com/MIM_Spell"-->
<!--          class="link-item ml"-->
<!--        >-->
<!--          <img src="@/assets/images/twitter-pixel.svg" alt="" />-->
<!--        </a>-->
<!--      </div>-->
<!--    </div>-->
<!--  </footer>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  computed: {-->
<!--    itsTransparent() {-->
<!--      const pages = ["Home", "Docs", "Tech", "Liquidations"];-->

<!--      return pages.indexOf(this.$route.name) !== -1;-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
<!--<style scoped lang="scss">-->
<!--.app-footer {-->
<!--  height: $footerHeight;-->
<!--  overflow: hidden;-->

<!--  &.transparent {-->
<!--    position: absolute;-->
<!--    bottom: 0;-->
<!--    left: 0;-->
<!--    width: 100%;-->
<!--  }-->

<!--  .container {-->
<!--    height: 100%;-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    position: relative;-->
<!--    z-index: 2;-->

<!--    .skulls-wrap {-->
<!--      display: flex;-->
<!--      height: 100%;-->

<!--      .skulls-img {-->
<!--        height: 100%;-->
<!--        width: auto;-->
<!--      }-->

<!--      .img-2 {-->
<!--        transform: translateY(45%);-->
<!--        margin-left: 8px;-->
<!--      }-->
<!--    }-->

<!--    .footer-nav {-->
<!--      display: flex;-->
<!--      align-items: center;-->
<!--      margin: 0 20px;-->

<!--      .nav-link {-->
<!--        font-size: 16px;-->
<!--        line-height: 1.5;-->
<!--        text-align: center;-->
<!--        letter-spacing: 0.05em;-->
<!--        color: #ffffff;-->
<!--        margin: 0 20px;-->
<!--        text-decoration: none;-->
<!--        transition: all 0.3s ease;-->

<!--        &:hover {-->
<!--          color: $clrNavHover;-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    .links-wrap {-->
<!--      display: flex;-->
<!--      align-items: center;-->
<!--      margin-left: auto;-->

<!--      .link-item {-->
<!--        display: block;-->

<!--        &.ml {-->
<!--          margin-left: 30px;-->
<!--        }-->

<!--        img {-->
<!--          height: 12.5px;-->
<!--          width: auto;-->
<!--          object-fit: contain;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--@media screen and(max-width: 980px) {-->
<!--  .app-footer .container .footer-nav {-->
<!--    display: none;-->
<!--  }-->
<!--}-->

<!--@media screen and(max-width: 780px) {-->
<!--  .app-footer .container .links-wrap .link-item.ml {-->
<!--    margin-left: 30px;-->
<!--  }-->
<!--  .app-footer .container .skulls-wrap .skulls-img {-->
<!--    height: auto;-->
<!--    width: 45px;-->
<!--  }-->

<!--  .app-footer .container .skulls-wrap .img-2 {-->
<!--    transform: translateY(25%);-->
<!--    margin-left: 0;-->
<!--  }-->
<!--}-->
<!--</style>-->
