<template>
  <div class="stand-table-item lighter">
    <div class="table-col pool-name">
      <div class="val-item">
        <TokenIcon :token="pool.name" />
        <p>
          {{ pool.name }} <br />
          <span class="pool-type" v-if="pool.nameSubtitle">{{
            pool.nameSubtitle
          }}</span>
        </p>
      </div>
    </div>
    <div class="table-col">
      <p>{{ pool.poolYield }}</p>
      <p class="mini-text">{{ pool.tokenName }}/day</p>
    </div>
    <div class="table-col">
      <p>{{ pool.poolRoi }}%</p>
    </div>
    <div class="table-col">
      <div class="val-item">
        <!-- <img src="@/assets/images/pixel-eth.svg" alt="" class="val-icon" /> -->
        <p>$ {{ pool.poolTvl }}</p>
      </div>
    </div>

    <div class="action-col">
      <template v-if="pool.allowance">
        <button class="btn mini" @click="stakeHandler">Stake</button>
        <button class="btn mini" @click="unstakeHandler">unstake</button>
      </template>
      <button class="btn mini" v-else @click="approveHandler">APPROVE</button>
    </div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/UiComponents/TokenIcon");

export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    stakeHandler() {
      this.$store.commit("setPopupState", {
        type: "stake",
        isShow: true,
        datas: { poolId: this.pool.id },
      });
    },
    unstakeHandler() {
      this.$store.commit("setPopupState", {
        type: "unstake",
        isShow: true,
        datas: { poolId: this.pool.id },
      });
    },
    async approveHandler() {
      try {
        const tx = await this.pool.erc20ContractInstance.approve(
          this.pool.contractAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const receipt = await tx.wait();

        console.log(receipt);
      } catch (error) {
        console.log("approve err:", error);
      }
    },
  },
  components: {
    TokenIcon,
  },
};
</script>

<style scoped lang="scss">
.stand-table-item {
  display: flex;
  align-items: center;
  padding: 13px 30px;
  background-color: $clrBlue2;
  border-radius: 12px;
  margin-bottom: 10px;
  min-height: 120px;

  .pool-type {
    font-size: 12px;
  }

  &.hidden {
    filter: blur(2px);
    pointer-events: none;
  }

  &.lighter {
    background-color: $clrBlue3;
  }

  .action-col {
    width: 150px;
    padding-left: 30px;

    .btn {
      width: 100%;
      background: rgba(255, 255, 255, 0.1);

      &:first-child {
        margin-bottom: 10px;
      }
    }
  }

  .table-col {
    width: calc((100% - 150px) / 4);
    text-align: left;

    &.pool-name {
      p {
        text-transform: inherit;
      }
    }

    p {
      text-transform: uppercase;
      font-size: 16px;
      line-height: 1;
    }

    .mini-text {
      font-size: 10px;
      padding-top: 3px;
      text-transform: inherit;
    }
  }

  .val-item {
    display: flex;
    align-items: center;
  }

  .val-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    margin-right: 10px;
  }
}

@media screen and(max-width: 780px) {
  .stand-table-item {
    flex-wrap: wrap;
    justify-content: center;
    min-height: 100px;

    .table-col {
      width: 25%;
    }

    .action-col {
      padding-left: 0;
      display: flex;
      align-items: center;
      width: auto;
      margin-top: 20px;

      .btn {
        width: 120px;
        margin: 0 5px;
      }

      .btn:first-child {
        margin-bottom: 0;
      }
    }
  }
}

@media screen and(max-width: 640px) {
  .stand-table-item {
    padding-left: 10px;
    padding-right: 10px;
  }

  .stand-table-item .table-col p {
    font-size: 12px;
  }

  .stand-table-item .val-icon {
    width: 24px;
    height: 24px;
  }

  .stand-table-item .val-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .stand-table-item .val-icon {
    margin-bottom: 5px;
  }
}
</style>
