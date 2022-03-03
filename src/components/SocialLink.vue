<template>
  <footer class="app-socialLink" :class="{ transparent: itsTransparent }">
    <div class="container">
      <nav class="footer-nav">
        <router-link :to="{ name: 'GitBook' }" class="nav-link">
          {{textBtn.data}}
        </router-link
        >
      </nav>
      <div class="links-wrap">
        <a
          target="_blank"
          :href="discord.link"
          class="link-item discord">
          <img :src="imgDiscord" alt="" />
        </a>
        <a
          target="_blank"
          :href="twitter.link"
          class="link-item twitter">
          <img :src="imgTwitter" alt="" />
        </a>
        <a
          target="_blank"
          :href="medium.link"
          class="link-item medium">
          <img :src="imgMedium" alt="" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
import imgDiscord from "@/assets/images/social-links-items/Discord.svg";
import imgTwitter from "@/assets/images/social-links-items/Twitter.svg";
import imgMedium from "@/assets/images/social-links-items/Medium.svg";

export default {
  data() {
    return {
      imgDiscord,
      imgTwitter,
      imgMedium,
    }
  },
  props: ['textBtn', 'discord', 'twitter', 'medium'],
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
  height: $footerHeight;
  margin: 0;
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
    margin: 0 82px 0 80px;

    .footer-nav {
      display: flex;
      align-items: center;

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