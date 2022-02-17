<template>
  <div class="token-block">
    <div class="content-wrap">
      <div class="info-wrap">
        <div class="head-wrap">
          <p class="token-name">
            {{ tokensInfo.mainToken.name }} (~ 99.3% annualised APY)
          </p>

          <template v-if="lockedUntil && Number(lockedUntil) !== 0">
            <LockedTimer :finalTime="lockedUntil" />
          </template>
        </div>

        <div class="row">
          <TokenIcon :token="tokensInfo.mainToken.name" :full="true" />
          <div class="value-amount">
            <p class="token-val">{{ formattedBalance }}</p>
            <!-- <p class="money-val">$ {{ formattedBalance }}</p> -->
          </div>
        </div>
      </div>

      <div class="btns-wrap">
        <template v-if="isApproved">
          <button
            class="btn mini stake-btn"
            @click.prevent="showStakePopup('stake')"
          >
            Stake
          </button>
          <button
            class="btn mini"
            @click.prevent="showStakePopup('unstake')"
            :disabled="lockedUntil && Number(lockedUntil) !== 0"
          >
            Unstake
          </button>
        </template>
        <template v-else>
          <button class="btn mini" @click.prevent="approveToken">
            approve
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
const TokenIcon = () => import("@/components/UiComponents/TokenIcon");
const LockedTimer = () => import("@/components/Dashboard/LockedTimer");

export default {
  props: {
    tokensInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      exactBalance: "x.x",
      balance: "x.x",
      isApproved: false,
      lockedUntil: false,
      balanceTimeout: null,
    };
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
    formattedBalance() {
      if (this.exactBalance !== "x.x") {
        const balance = this.$ethers.utils.formatEther(this.exactBalance);
        // eslint-disable-next-line no-useless-escape
        let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`);
        return balance.toString().match(re)[0];
      }

      return "x.x";
    },
  },
  methods: {
    showStakePopup(type) {
      this.$store.commit("setPopupState", {
        type: "token-stake",
        isShow: true,
        datas: {
          type,
        },
      });
    },
    async getUserBalance() {
      try {
        const balance =
          await this.tokensInfo.mainToken.contractInstance.balanceOf(
            this.account
          );

        this.exactBalance = balance.toString();

        console.log();
      } catch (e) {
        console.log("getUserBalance err:", e);
      }
    },
    async isTokenApprowed() {
      try {
        const addressApprowed =
          await this.tokensInfo.stakeToken.contractInstance.allowance(
            this.account,
            this.tokensInfo.mainToken.contractInstance.address,
            {
              gasLimit: 1000000,
            }
          );
        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("SPELL isApprowed err:", e);
        return false;
      }
    },
    async approveToken() {
      try {
        const estimateGas =
          await this.tokensInfo.stakeToken.contractInstance.estimateGas.approve(
            this.tokensInfo.mainToken.contractInstance.address,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.tokensInfo.stakeToken.contractInstance.approve(
          this.tokensInfo.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        this.isApproved = true;
        console.log("APPROVE RESP:", receipt);
        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },
    async getUserLocked() {
      try {
        const infoResp = await this.tokensInfo.mainToken.contractInstance.users(
          this.account,
          {
            gasLimit: 1000000,
          }
        );

        const lockTimestamp = infoResp.lockedUntil.toString();
        const currentTimestamp = moment().unix().toString();

        console.log(lockTimestamp, currentTimestamp);

        if (lockTimestamp && lockTimestamp > currentTimestamp)
          return lockTimestamp;
        return false;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },
  },
  async created() {
    await this.getUserBalance();
    this.lockedUntil = await this.getUserLocked();
    this.isApproved = await this.isTokenApprowed();

    this.balanceTimeout = setInterval(async () => {
      await this.getUserBalance();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.balanceTimeout);
  },
  components: { TokenIcon, LockedTimer },
};
</script>

<style lang="scss" scoped>
.token-block {
  background: rgba(24, 18, 53, 0.5);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;

  .content-wrap {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background: #221b47;
    border: 1px solid #181235;
    border-radius: 20px;

    .head-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .info-wrap {
      text-align: left;

      .token-img {
        width: 36px;
        height: 36px;
        object-fit: contain;
        margin-right: 30px;
      }

      .token-val {
        font-size: 30px;
      }

      .money-val {
        font-size: 20px;
      }

      .value-amount {
        line-height: 1;
      }

      .row {
        margin-top: 20px;
        display: flex;
        align-items: center;
      }
    }

    .btns-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .stake-btn {
        margin-bottom: 14px;
      }
    }
  }
}

@media screen and(max-width: 680px) {
  .token-block .content-wrap {
    flex-direction: column;
  }

  .token-block .content-wrap .btns-wrap {
    margin-top: 15px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
