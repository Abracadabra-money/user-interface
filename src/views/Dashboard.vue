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
  padding-top: 160px;
  padding-bottom: 100px;
  flex: 1;

  h1 {
    margin-bottom: 60px;
  }

  .transaction-btn {
    margin-left: auto;
    cursor: pointer;
    width: max-content;
    margin-bottom: 30px;

    p {
      font-size: 20px;
      text-transform: uppercase;
      color: $clrBlue;
    }
  }

  .btns-group {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .btn {
      width: 127px;
      font-size: 16px;
      line-height: 1;
      background: rgba(123, 121, 247, 0.3);

      &:hover {
        background-color: $clrBlue5;
      }

      &.borrow-btn {
        margin-right: 20px;
      }

      &.active {
        background-color: $clrBlue;
      }
    }
  }

  .items-wrap {
    display: grid;
    grid-template-columns: 50% 50%;
    column-gap: 20px;
    row-gap: 20px;
  }
}

@media screen and(max-width: 1024px) {
  .dashboard-view {
    padding-top: 80px;
  }

  .dashboard-view .btns-group {
    justify-content: center;
  }

  .dashboard-view .btns-group .btn.borrow-btn {
    margin: 0 10px;
  }

  .dashboard-view .btns-group .btn {
    margin: 0 10px;
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
