<template>
  <footer class="app-socialLink" :class="{ transparent: itsTransparent }">
    <div class="container">
      <nav class="footer-nav">
        <router-link :to="{ name: 'GitBook' }" class="nav-link"
        >GitBook</router-link
        >
      </nav>
      <div class="links-wrap">
        <a
          target="_blank"
          href="https://medium.com/abracadabra-money"
          class="link-item"
        >
          <img src="@/assets/images/social-links-items/Discord.svg" alt="" />
        </a>
        <a
          target="_blank"
          href="https://twitter.com/MIM_Spell"
          class="link-item twitter"
        >
          <img src="@/assets/images/social-links-items/Twitter.svg" alt="" />
        </a>
        <a
          target="_blank"
          href="https://twitter.com/MIM_Spell"
          class="link-item medium"
        >
          <img src="@/assets/images/social-links-items/Medium.svg" alt="" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    itsTransparent() {
      const pages = ["Home", "Docs", "Tech", "GitBook"];

      return pages.indexOf(this.$route.name) !== -1;
    },
  },
};
</script>
<style scoped lang="scss">
.app-socialLink {
  height: $SocialLinksHeight;
  overflow: hidden;
  margin: 0px;
  background: #262626;

  &.transparent {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .container {
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;

    .footer-nav {
      display: flex;
      align-items: center;
      margin-left: 80px;

      .nav-link {
        width: 46px;
        height: 16px;
        font-family: Work Sans, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        color: #55BCC0;
        letter-spacing: 0.05em;
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
          color: $clrNavHover;
        }
      }
    }

    .links-wrap {
      display: flex;
      align-items: center;
      margin-left: auto;
      margin-right: 82px;

      .link-item {
        display: block;

        &.twitter {
          margin-left: 28px;
        }

        &.medium {
          margin-left: 28px;
        }

        img {
          height: auto;
          width: 20px;
          left: 2px;
          top: 4px;
          object-fit: contain;
        }
      }
    }
  }
}

@media screen and(max-width: 980px) {
  .app-socialLink .container .footer-nav {
    display: none;
  }
}

@media screen and(max-width: 780px) {
  .app-socialLink .container .links-wrap .link-item.ml {
    margin-left: 30px;
  }
  .app-socialLink .container {
    height: auto;
    width: 45px;
  }

  .app-socialLink .container {
    transform: translateY(25%);
    margin-left: 0;
  }
}
</style>
