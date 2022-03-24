<template>
  <div class="dashboard-view">
    <div class="container mini">
      <h1>Dashboard</h1>

      <div class="transaction-btn" @click="toTransactions" v-if="false">
        <p>Transactions</p>
      </div>

      <template v-if="pools">
        <StatisticsBlock :pools="userPools" />

        <div class="btns-group">
          <button
            class="btn mini borrow-btn"
            :class="{ active: shortcutState === 'borrow' }"
            @click="setShortcutType('borrow')"
          >
            Borrow
          </button>
          <button
            class="btn mini replay-btn"
            :class="{ active: shortcutState === 'repay' }"
            @click="setShortcutType('repay')"
          >
            Repay
          </button>
        </div>

        <div class="items-wrap" v-if="userPools.length">
          <OpenPoolItem
            v-for="pool in userPools"
            :pool="pool"
            :key="pool.id"
            :actionType="shortcutState"
          />
        </div>

        <EmptyPoolsState :blockType="shortcutState" v-else />
      </template>
    </div>
  </div>
</template>

<script>
const StatisticsBlock = () => import("@/components/Dashboard/StatisticsBlock");
const OpenPoolItem = () => import("@/components/Dashboard/OpenPoolItem");
const EmptyPoolsState = () => import("@/components/Dashboard/EmptyPoolsState");

import sspellToken from "@/mixins/sspellToken.js";

export default {
  mixins: [sspellToken],
  data() {
    return {
      shortcutState: "borrow",
    };
  },
  computed: {
    pools() {
      return this.$store.getters.getPools;
    },
    userPools() {
      return this.pools.filter(
        (pool) =>
          pool.userBorrowPart !== "0.0" && pool.userCollateralShare !== "0.0"
      );
    },
  },
  methods: {
    setShortcutType(type) {
      if (type !== this.shortcutState) this.shortcutState = type;
    },
    toTransactions() {
      // this.$router.push({ name: "Transactions" });
    },
    async getUserBorrowPart(poolContract) {
      try {
        const userBorrowPart = await poolContract.userBorrowPart(this.account);
        return userBorrowPart;
      } catch (e) {
        console.log("getuserBorrowPartNonce err:", e);
      }
    },
    async getUserCollateralShare(poolContract) {
      try {
        const userCollateralShare = await poolContract.userCollateralShare(
          this.account
        );
        return userCollateralShare;
      } catch (e) {
        console.log("getUserCollateralShare err:", e);
      }
    },
  },
  async created() {
    const isConnected = this.$store.getters.getWalletIsConnected;

    if (!isConnected) {
      this.$router.push({ name: "Home" });
      alert("Connect wallet first");
      return false;
    }
    await this.createStakePool();
  },
  mounted() {},
  components: {
    StatisticsBlock,
    OpenPoolItem,
    EmptyPoolsState,
  },
};
</script>

<style lang="scss" scoped>
.dashboard-view {
  padding-top: 40px;
  padding-bottom: 40px;
  flex: 1;

  h1 {
    font-size: 32px;
    line-height: 36px;
    margin-bottom: 20px;
    text-align: left;
  }

  .transaction-btn {
    margin-left: auto;
    cursor: pointer;
    width: max-content;
    margin-bottom: 30px;

    p {
      font-size: 20px;
      color: $clrBlue;
    }
  }

  .btns-group {
    display: flex;
    align-items: center;
    width: 146px;
    height: 32px;
    background: #262626;
    border-radius: 100px;
    padding: 2px;
    margin-bottom: 24px;

    .btn {
      width: 73px;
      height: 28px;
      font-size: 14px;
      line-height: 20px;
      background: #262626;

      &:hover {
        //background-color: $clrBlue5;
      }

      &.borrow-btn {
        //margin-right: 20px;
      }

      &.active {
        color: black;
        background-color: $clrBg3;
      }
    }
  }

  .items-wrap {
    display: grid;
    grid-template-columns: 486px 486px;
    column-gap: 26px;
    row-gap: 26px;
  }
}

@media screen and(max-width: 1024px) {
  .dashboard-view {
    padding-top: 80px;
  }

  .dashboard-view .btns-group {
    justify-content: center;
  }
}

@media screen and(max-width: 780px) {
  .dashboard-view .transaction-btn {
    margin-right: auto;
    margin-bottom: 40px;
  }
  .dashboard-view .items-wrap {
    grid-template-columns: 100%;
  }
}

@media screen and(max-width: 640px) {
}
</style>
