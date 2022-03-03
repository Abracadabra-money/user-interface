<template>
  <footer class="app-footer" :class="{ transparent: itsTransparent }">
    <SocialLink
      :textBtn="textBtn"
      :discord="discord"
      :twitter="twitter"
      :medium="medium"
    />
  </footer>
</template>

<script>
import SocialLink from "@/components/SocialLink";

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SocialLink,
  },
  data() {
    return {
      textBtn: {
        data: "GitBook",
        link: "https://medium.com/abracadabra-money",
      },
      discord: {
        data: "@/assets/images/social-links-items/Discord.svg",
        link: "https://discord.com",
      },
      twitter: {
        //data: "@/assets/images/social-links-items/Twitter.svg",
        link: "https://twitter.com/MIM_Spell",
      },
      medium: {
        //data: "@/assets/images/social-links-items/Medium.svg",
        link: "https://medium.com/abracadabra-money",
      },
    }
  },
  computed: {
    itsTransparent() {
      const pages = ["Home", "Docs", "Tech", "Liquidations"];

      return pages.indexOf(this.$route.name) !== -1;
    },
  },
};
</script>