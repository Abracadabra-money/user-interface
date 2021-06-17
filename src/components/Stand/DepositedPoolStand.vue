<template>
  <div class="pool-deposited-stand" v-if="infoItemsData.length">
    <DepositInfoItem
      v-for="(item, idx) in infoItemsData"
      :key="idx"
      :dataObj="item"
      @click="actionHandler"
    />
  </div>
</template>

<script>
const DepositInfoItem = () => import("@/components/Stand/DepositInfoItem");

export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      infoItemsData: [],
      updateTimer: null,
    };
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    async actionHandler(actionType) {
      console.log(actionType);

      if (actionType === "deposit") {
        this.openUnstakePopup();
      }

      if (actionType === "earned") {
        await this.harvest();
      }
    },
    async harvest() {
      try {
        const tx = await this.pool.contractInstance.withdraw(
          this.pool.poolId,
          0
        );

        const receipt = await tx.wait();

        console.log("unstakeHandler success:", receipt);
      } catch (error) {
        console.log("harvest err:", error);
      }
    },
    openUnstakePopup() {
      this.$store.commit("setPopupState", {
        type: "unstake",
        isShow: true,
        datas: { poolId: this.pool.id },
      });
    },
    async createDepositItem(amount) {
      const price = parseFloat(amount * this.pool.lpPrice).toFixed(4);

      return {
        mainValue: parseFloat(amount).toFixed(4),
        usdValue: price,
        tokenName: this.pool.stakingTokenName,
        tokenType: this.pool.stakingTokenType,
        link: this.pool.stakingTokenLink,
        type: "deposit",
      };
    },
    async createEarnedItem(amount) {
      const price = parseFloat(amount * this.pool.tokenPrice).toFixed(4);

      return {
        mainValue: parseFloat(amount).toFixed(4),
        usdValue: price,
        tokenName: this.pool.tokenName,
        type: "earned",
      };
    },
    async initStand() {
      try {
        const userInfo = await this.pool.contractInstance.userInfo(
          this.pool.poolId,
          this.account
        );

        const userDeposited = parseFloat(
          this.$ethers.utils.formatEther(userInfo?.amount.toString())
        ).toFixed(4);

        const userReward = await this.pool.contractInstance.pendingIce(
          this.pool.poolId,
          this.account
        );

        const userRewardParsed = parseFloat(
          this.$ethers.utils.formatEther(userReward.toString())
        ).toFixed(4);

        console.log("user deposited", userDeposited);
        console.log("user reward", userRewardParsed);

        const earnedInfo = await this.createEarnedItem(
          parseFloat(userRewardParsed)
        );
        const depositInfo = await this.createDepositItem(
          parseFloat(userDeposited)
        );

        this.infoItemsData = [earnedInfo, depositInfo];
      } catch (error) {
        console.log("getDeposited err:", error);
      }
    },
  },
  async created() {
    await this.initStand();

    this.updateTimer = setInterval(async () => {
      await this.initStand();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.updateTimer);
  },
  components: {
    DepositInfoItem,
  },
};
</script>

<style lang="scss" scoped>
.pool-deposited-stand {
  display: flex;
  justify-content: space-between;
  background-color: #2b408e;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 30px;
}

@media screen and(max-width: 780px) {
  .pool-deposited-stand {
    flex-direction: column;
  }
}
</style>
