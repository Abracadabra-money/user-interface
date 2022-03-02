<template>
  <header class="app-header" :class="{ transparent: itsTransparent }">
    <div class="container">
<!--      <transition name="fade">-->
<!--        <img-->
<!--          v-if="showLogoBg"-->
<!--          src="@/assets/images/logo-bg.svg"-->
<!--          alt=""-->
<!--          class="logo-bg"-->
<!--        />-->
<!--      </transition>-->
      <div class="containerS">
        <div>
          <router-link :to="{ name: 'Home' }" class="logo-wrap">
            <img src="@/assets/images/text-logo.svg" alt="" class="logo" />
          </router-link>
        </div>
          <router-link :to="{ name: 'Stand' }" class="nereus-btn"> Nereus Markets </router-link>
      </div>

      <nav>
        <!--        <router-link :to="{ name: 'FarmStand' }" class="nav-link"-->
        <!--          >farm</router-link-->
        <!--        >-->

        <div>
          <router-link :to="{ name: 'Borrow' }" class="borrow-btn"> Borrow </router-link>
        </div>

        <!-- <router-link :to="{ name: 'Mim3Pool' }" class="nav-link"
          >MIM3POOL</router-link
        > -->
        <!--        <a href="https://crv.to/pool" target="_blank" class="nav-link"-->
        <!--          >MIM3POOL</a-->
        <!--        >-->

        <!--        <a href="https://crv.to/" target="_blank" class="nav-link">swap</a>-->

        <!-- <p class="nav-link" @click="showSwapPopup">Swap</p> -->

        <div class="btns-wrap">
          <NetworkButton
            @click="networkClickHandler"
            :networkType="activeNetwork"/>

          <div class="btn-margin">
            <ConnectButton />
          </div>
        </div>

<!--        <TokenButton :tokenName="'Spell'" v-if="!itsDashboard" />-->
<!--        <TokenButton :tokenName="'sSpell'" v-if="itsDashboard" />-->
<!--        <TokenButton :tokenName="'MIM'" />-->
      </nav>

      <img
        src="@/assets/images/mobile-menu.svg"
        alt=""
        class="mobile-btn"
        @click="menuClickHandler"
      />
    </div>
  </header>
</template>

<script>
const NetworkButton = () => import("@/components/UiComponents/NetworkButton");
const ConnectButton = () => import("@/components/UiComponents/ConnectButton");
//const TokenButton = () => import("@/components/UiComponents/AddTokenBtn");

export default {
  computed: {
    isSwapEnable() {
      return !!this.$store.getters.getSwapObject;
    },
    showLogoBg() {
      const pages = ["Home"];

      return pages.indexOf(this.$route.name) !== -1;
    },
    itsTransparent() {
      const pages = ["Home", "Docs", "Tech", "Liquidations"];

      return pages.indexOf(this.$route.name) !== -1;
    },
    activeNetwork() {
      return this.$store.getters.getActiveNetwork;
    },
    itsDashboard() {
      return this.$route.name === "Dashboard";
    },
  },
  methods: {
    showSwapPopup() {
      this.$store.commit("setPopupState", {
        type: "swap",
        isShow: true,
      });
    },
    networkClickHandler() {
      this.$store.commit("setPopupState", {
        type: "network",
        isShow: true,
      });
    },
    menuClickHandler() {
      const isAlreadyOpen = this.$store.getters.getPopupState;
      const openPopupType = this.$store.getters.getPopupType;

      if (isAlreadyOpen && openPopupType === "sidemenu") {
        this.$store.commit("closePopups");
        return;
      }

      this.$store.commit("setPopupState", {
        type: "sidemenu",
        isShow: true,
      });
    },
  },
  components: {
    NetworkButton,
    ConnectButton,
    //TokenButton,
  },
};
</script>

<style lang="scss" scoped>
.app-header {
  background: #4D4AEC;
  height: $headerHeight;
  z-index: 200;

  &.transparent {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    //.logo-bg {
    //  display: block;
    //}
  }

  //.logo-bg {
  //  display: none;
  //
  //  position: absolute;
  //  top: -30px;
  //  left: -125px;
  //  width: auto;
  //  z-index: 1;
  //}

  .container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-left: 80px;
  }

  .containerS {
    display: flex;
    align-items: center;
  }
  .logo {
    height: 32px;
    width: 146px;
    object-fit: contain;
    z-index: 2;
  }

  //.token-btn {
  //  margin-left: 30px;
  //  width: 36px;
  //  height: 36px;
  //  background: none;
  //  border: none;
  //  cursor: pointer;
  //
  //  img {
  //    max-width: 100%;
  //    height: auto;
  //  }
  //}

  nav {
    display: flex;
    align-items: center;
    flex-direction: row;
    z-index: 2;

    .btns-wrap {
      margin-left: 12px;
      display: flex;
      align-items: center;

      .btn-margin {
        margin-left: 12px;
        margin-right: 80px;
      }
    }
  }

  .borrow-btn {
    color: #FFFFFF;
    font-size: 16px;
    font-style: normal;
    text-align: center;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    background: rgba(28, 28, 28, 0.16);
    padding: 8px 15px;
    width: 80px;
    height: 32px;
    border-radius: 21px;

    &:hover {
      color: $clrNavHover;
    }
  }

  .nereus-btn {
    padding: 6px 16px;
    height: 32px;
    width: 139px;
    border-radius: 16px;

    margin-left: 40px;
    top: 24px;
    background: #55BCC0;
    font-family: "Work Sans", sans-serif;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;

    color: #FFFFFF;
    flex: none;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;


    &:hover {
      color: black;
      background: #E7FC6E;
    }
  }



  .mobile-btn {
    width: 24px;
    height: auto;
    object-fit: contain;
    cursor: pointer;
    display: none;
  }
}

@media screen and(max-width: 1280px) {
  .app-header .logo {
    width: 146px;
  }

  .app-header nav .borrow-btn {
    font-size: 16px;
  }
}

@media screen and(max-width: 1200px) {
  .app-header .logo {
    width: 170px;
  }

  .app-header nav .borrow-btn {
    margin: 0 13px;
    font-size: 16px;
  }

  .app-header nav .btns-wrap,
  .app-header nav .btns-wrap .btn-margin {
    margin-left: 15px;
  }
}

@media screen and(max-width: 980px) {
  .app-header.transparent .logo-bg {
    display: none;
  }
  .app-header nav {
    display: none;
  }

  .app-header .mobile-btn {
    display: block;
  }

  .app-header .logo {
    width: 130px;
  }
}
</style>
