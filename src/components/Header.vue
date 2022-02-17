<template>
  <header class="app-header" :class="{ transparent: itsTransparent }">
    <div class="container">
      <transition name="fade">
        <img
          v-if="showLogoBg"
          src="@/assets/images/logo-bg.svg"
          alt=""
          class="logo-bg"
        />
      </transition>

      <router-link :to="{ name: 'Home' }" class="logo-wrap"
        ><img src="@/assets/images/text-logo.svg" alt="" class="logo"
      /></router-link>

      <nav>
        <!--        <router-link :to="{ name: 'FarmStand' }" class="nav-link"-->
        <!--          >farm</router-link-->
        <!--        >-->
        <router-link :to="{ name: 'Stand' }" class="nav-link"
          >borrow</router-link
        >

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
            :networkType="activeNetwork"
          />

          <div class="btn-margin">
            <ConnectButton />
          </div>
        </div>

        <TokenButton :tokenName="'Spell'" v-if="!itsDashboard" />
        <TokenButton :tokenName="'sSpell'" v-if="itsDashboard" />
        <TokenButton :tokenName="'MIM'" />
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
const TokenButton = () => import("@/components/UiComponents/AddTokenBtn");

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
    TokenButton,
  },
};
</script>

<style lang="scss" scoped>
.app-header {
  height: $headerHeight;
  z-index: 200;

  &.transparent {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .logo-bg {
      display: block;
    }
  }

  .logo-bg {
    display: none;

    position: absolute;
    top: -30px;
    left: -125px;
    width: auto;
    z-index: 1;
  }

  .container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .logo {
    width: 220px;
    height: auto;
    object-fit: contain;
    position: relative;
    z-index: 2;
  }

  .token-btn {
    margin-left: 30px;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    cursor: pointer;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  nav {
    display: flex;
    align-items: center;
    margin-left: auto;
    position: relative;
    z-index: 2;

    .btns-wrap {
      margin-left: 30px;
      display: flex;
      align-items: center;

      .btn-margin {
        margin-left: 30px;
      }
    }

    .nav-link {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 1.2;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 30px;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        color: $clrNavHover;
      }
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
    width: 180px;
  }

  .app-header nav .nav-link {
    margin: 0 14px;
    font-size: 14px;
  }
}

@media screen and(max-width: 1200px) {
  .app-header .logo {
    width: 170px;
  }

  .app-header nav .nav-link {
    margin: 0 13px;
    font-size: 14px;
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
