<template>
  <div class="mim-pool-view">
    <div class="container mini">
      <h1>MIM3POOL</h1>

      <div class="btns-group">
        <button
          class="btn mini borrow-btn"
          :class="{ active: actionType === 'deposit' }"
          @click="setActionType('deposit')"
        >
          Deposit
        </button>
        <button
          class="btn mini replay-btn"
          :class="{ active: actionType === 'withdraw' }"
          @click="setActionType('withdraw')"
        >
          Withdraw
        </button>
      </div>

      <div class="pool-content" v-if="pool">
        <div class="main-col" v-if="actionType === 'deposit'">
          <PoolActionStand :tokens="pool.tokens" @onDeposit="depositHandler" />
        </div>

        <div class="main-col" v-if="actionType === 'withdraw'">
          <PoolWithdrawStand
            :tokens="pool.tokens"
            :userBalance="pool.userLpBalance"
            @onWithdraw="withdrawHandler"
          />
        </div>

        <div class="aside-col">
          <PoolStatisticsStand />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const PoolActionStand = () => import("@/components/Mim3Pool/PoolActionStand");
const PoolWithdrawStand = () =>
  import("@/components/Mim3Pool/PoolWithdrawStand");
const PoolStatisticsStand = () =>
  import("@/components/Mim3Pool/StatisticsStand");

import mim3PoolMixin from "@/mixins/mim3pool.js";

export default {
  mixins: [mim3PoolMixin],
  data() {
    return {
      actionType: "deposit",
    };
  },
  computed: {
    pool() {
      return this.$store.getters.getMim3Pools;
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    setActionType(type) {
      if (type !== this.actionType) this.actionType = type;
    },
    async depositHandler(tokens) {
      console.log("depositHandler", tokens);

      const amounts = tokens.map((token) => {
        if (parseFloat(token.amount)) {
          return this.$ethers.utils
            .parseUnits(token.amount, token.decimals)
            .toString();
        }

        return 0;
      });

      const checkedTokens = await Promise.all(
        tokens.map((token) => this.checkTokenAllowance(token))
      );

      const tokensApproved = checkedTokens.indexOf(false) === -1;

      console.log("tokensApproved", tokensApproved);

      if (!tokensApproved) return false;

      console.log(amounts);

      console.log(checkedTokens);

      const mintAmount = await this.getMinAmount(amounts, true);
      const minMintAmount = mintAmount * 0.99;

      await this.addLiquidity(amounts, minMintAmount.toString());
    },
    async withdrawHandler({ tokens, isImbalance }) {
      console.log("withdrawHandler", tokens, isImbalance);

      const amounts = tokens.map((token) => {
        if (parseFloat(token.amount)) {
          return String(
            this.$ethers.utils
              .parseUnits(token.amount, token.decimals)
              .toString()
          );
        }

        return 0;
      });

      const isOneCoin =
        amounts.filter((amount) => parseFloat(amount) === 0).length === 3;

      if (isOneCoin) {
        let oneCoinAmount = amounts.find((amount) => parseFloat(amount) !== 0);
        const oneCoinIdx = amounts.indexOf(oneCoinAmount);

        const token = tokens[oneCoinIdx];

        console.log("oneCoinAmount", oneCoinAmount);
        if (token.decimals !== 18) {
          oneCoinAmount = this.$ethers.utils.parseUnits(token.amount, 18);
        }

        const minAmount = await this.getOneCoinMin(oneCoinAmount, oneCoinIdx);
        let minMintAmount = parseFloat(minAmount * 0.99).toFixed(0);

        console.log(
          "its One coin:",
          oneCoinAmount.toString(),
          token.name,
          minMintAmount
        );

        await this.removeLiquidityOneCoin(
          oneCoinAmount.toString(),
          oneCoinIdx,
          minMintAmount.toString()
        );
        return false;
      }

      if (isImbalance) {
        console.log("IT IS IMBALANCE");

        const mintAmount = await this.getMinAmount(amounts, false);
        const manMintAmount = mintAmount * 1.01;

        await this.removeLiquidityImbalance(amounts, manMintAmount.toString());

        return false;
      }

      const userBalance = this.$ethers.utils
        .parseUnits(this.pool.userLpBalance, this.pool.lpTokenDecimals)
        .toString();

      await this.removeLiquidity(amounts, userBalance);

      console.log("depositHandler", tokens, isImbalance, amounts, isOneCoin);
    },
    async removeLiquidity(amounts, burnAmount) {
      console.log("removeLiquidity", amounts, burnAmount);
      try {
        const tx = await this.pool.contractInstance[
          "remove_liquidity(address,uint256,uint256[4])"
        ](this.pool.poolAddress, burnAmount, amounts, {
          gasLimit: 700000,
        });

        const receipt = await tx.wait();
        console.log("removeLiquidity", receipt);
      } catch (e) {
        console.log("removeLiquidity err:", e);
      }
    },
    async removeLiquidityImbalance(amounts, maxBurnAmount) {
      console.log("removeLiquidityImbalance", amounts, maxBurnAmount);
      try {
        const tx = await this.pool.contractInstance[
          "remove_liquidity_imbalance(address,uint256[4],uint256)"
        ](this.pool.poolAddress, amounts, maxBurnAmount, {
          gasLimit: 700000,
        });

        const receipt = await tx.wait();
        console.log("removeLiquidityImbalance", receipt);
      } catch (e) {
        console.log("removeLiquidityImbalance err:", e);
      }
    },
    async removeLiquidityOneCoin(burn, tokenIdx, minAmount) {
      console.log("removeLiquidityOneCoin", burn, tokenIdx, minAmount);
      try {
        const tx = await this.pool.contractInstance[
          "remove_liquidity_one_coin(address,uint256,int128,uint256)"
        ](this.pool.poolAddress, burn, tokenIdx, minAmount, {
          gasLimit: 700000,
        });

        const receipt = await tx.wait();
        console.log("removeLiquidityOneCoin", receipt);
      } catch (e) {
        console.log("removeLiquidityOneCoin err:", e);
      }
    },
    async addLiquidity(amounts, minMintAmount) {
      console.log("addLiquidity", amounts, minMintAmount);
      try {
        const estimateGas = await this.pool.contractInstance.estimateGas[
          "add_liquidity(address,uint256[4],uint256)"
        ](this.pool.poolAddress, amounts, minMintAmount);

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.pool.contractInstance[
          "add_liquidity(address,uint256[4],uint256)"
        ](this.pool.poolAddress, amounts, minMintAmount, {
          gasLimit,
        });

        const receipt = await tx.wait();
        console.log("addLiquidity", receipt);
      } catch (e) {
        console.log("addLiquidity", e);
      }
    },
    async getOneCoinMin(amount, tokenIdx) {
      try {
        const respAmount = await this.pool.contractInstance[
          "calc_withdraw_one_coin(address,uint256,int128)"
        ](this.pool.poolAddress, amount, tokenIdx, {
          gasLimit: 1000000,
        });
        console.log("getOneCoinMin", respAmount.toString());
        return respAmount;
      } catch (e) {
        console.log("getOneCoinMin", e);
      }
    },
    async getMinAmount(amounts, isDeposit) {
      try {
        const amount = await this.pool.contractInstance.calc_token_amount(
          this.pool.poolAddress,
          amounts,
          isDeposit,
          {
            gasLimit: 1000000,
          }
        );
        console.log("getMinAmount", amount.toString());
        return amount;
      } catch (e) {
        console.log("getMinAmount", e);
      }
    },
    async checkTokenAllowance(token) {
      try {
        if (parseFloat(token.amount) && !token.allowance) {
          const estimateGas = await token.contractInstance.approve(
            this.pool.contractInstance.address,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );

          const gasLimit = 1000 + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const tx = await token.contractInstance.approve(
            this.pool.contractInstance.address,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            { gasLimit }
          );

          const receipt = await tx.wait();
          console.log("ALLOWANCE RESP: ", receipt);
          return {
            ...token,
            allowance: parseFloat(receipt.toString()) > 0,
          };
        } else {
          return token;
        }
      } catch (e) {
        console.log("checkAllowance", e);
        return false;
      }
    },
  },
  async created() {
    await this.init3Pool();
  },
  components: {
    PoolActionStand,
    PoolStatisticsStand,
    PoolWithdrawStand,
  },
};
</script>

<style lang="scss" scoped>
.mim-pool-view {
  padding-top: 60px;
  padding-bottom: 155px;
  flex: 1;

  h1 {
    margin: 60px 0;
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

  .pool-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .main-col {
      margin-bottom: 20px;
      width: 61.78010471204188%;
    }

    .aside-col {
      margin-bottom: 20px;
      width: 36.12565445026178%;
    }
  }
}
</style>
