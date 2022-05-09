<template>
  <div class="mobile-menu">
    <div class="like-header">
      <router-link :to="{ name: 'Stand' }" class="logo-wrap"
        ><img src="@/assets/images/text-logo.svg" alt="" class="logo"
      /></router-link>

      <img
        src="@/assets/images/mobile-menu.svg"
        alt=""
        class="mobile-btn"
        @click="hideMenu"
      />
    </div>
    <div class="btns-wrap">
      <ConnectButton />

      <div class="btn-ml">
        <NetworkButton @click="networkClickHandler" />
      </div>
    </div>

    <nav>
      <router-link :to="{ name: 'Stand' }" class="nav-link"
        >Markets</router-link
      >
      <router-link :to="{ name: 'Dashboard' }" class="nav-link"
        >My Dashboard</router-link
      >
    </nav>
  </div>
</template>

<script>
const NetworkButton = () => import("@/components/UiComponents/NetworkButton");
const ConnectButton = () => import("@/components/UiComponents/ConnectButton");
export default {
  watch: {
    $route() {
      this.hideMenu();
    },
  },
  methods: {
    hideMenu() {
      this.$store.commit("closePopups");
    },
    networkClickHandler() {
      this.$store.commit("setPopupState", {
        type: "network",
        isShow: true,
      });
    },
    showSwapPopup() {
      this.$store.commit("setPopupState", {
        type: "swap",
        isShow: true,
      });
    },
  },
  components: {
    NetworkButton,
    ConnectButton,
  },
};
</script>

<style lang="scss" scoped>
.mobile-menu {
  padding: 30px 15px;
  padding-top: 0;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: $clrBg1;
  z-index: 400;
  display: flex;
  flex-direction: column;

  .like-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    min-height: 90px;
    .logo {
      width: 130px;
      height: auto;
      object-fit: contain;
      position: relative;
      z-index: 2;
    }

    .mobile-btn {
      width: 24px;
      height: auto;
      object-fit: contain;
      cursor: pointer;
    }
  }

  .btns-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 40px;

    .btn-ml {
      margin-left: 15px;
    }
  }

  nav {
    display: flex;
    flex-direction: column;
    text-align: left;
    overflow-y: auto;
  }

  .nav-link {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 1.2;
    text-transform: uppercase;
    color: #ffffff;
    margin: 18px 0;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: $clrNavHover;
    }
  }
}
</style>
