import stakeInfo from "@/utils/contracts/sSpellStakesInfo.js";

export default {
  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    createStakePool() {
      if (!stakeInfo) {
        return false;
      }

      const { mainToken, stakeToken } = stakeInfo;

      const mainTokenInstance = new this.$ethers.Contract(
        mainToken.address,
        JSON.stringify(mainToken.abi),
        this.signer
      );

      const stakeTokenInstance = new this.$ethers.Contract(
        stakeToken.address,
        JSON.stringify(stakeToken.abi),
        this.signer
      );

      const stakeObject = {
        mainToken: {
          ...mainToken,
          contractInstance: mainTokenInstance,
        },
        stakeToken: {
          ...stakeToken,
          contractInstance: stakeTokenInstance,
        },
      };

      console.log("STAKE TOKEN:", stakeObject);
      this.$store.commit("setSSpellObject", stakeObject);
    },
  },
};
