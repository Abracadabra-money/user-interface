<template>
  <div v-if="isConnected" class="stand-view">
    <div class="container mini">
      <div class="stand-group">
        <h1>NXUSD Markets</h1>

        <div class="stand-container">
          <div class="search-container">
            <input
              class="search-input"
              type="text"
              v-model="search"
              placeholder="Search"
            />
          </div>
          <div class="stand-sort">
            <select :disabled="disabledSort" v-model="sortParam">
              <option
                class="select-item"
                v-for="item in sortedBy"
                :key="item"
                @click="setSortParam(item)"
              >
                {{ item }}
              </option>
            </select>
          </div>
        </div>
        <StandTable :tableType="2" :items="filteredList" />
        <p
          class="notExist"
          v-if="!filteredList.length && this.search.length !== 0"
        >
          The search has not given any results
        </p>
      </div>
    </div>
  </div>
  <div v-else class="stand-action-view">
    <ActionComponent
      :text="text"
      :name="name"
      :onClick="walletBtnHandler"
      :disabled-status="disabledStatus"
    />
  </div>
</template>

<script>
const StandTable = () => import("@/components/Stand/Table");
const ActionComponent = () =>
  import("@/components/UiComponents/ActionComponent");

export default {
  data() {
    return {
      text: "Please connect your wallet",
      name: "Connect",
      disabledStatus: false,

      sortParam: "Sorted by Title",
      sortedBy: [
        "Sorted by Title",
        "NXUSD borrowed",
        "Liquidation fee",
        "NXUSD left",
      ],
      disabledSort: false,
      search: "",
    };
  },
  components: {
    StandTable,
    ActionComponent,
  },
  computed: {
    pools() {
      return this.$store.getters.getPools;
    },
    isConnected() {
      return this.$store.getters.getWalletIsConnected;
    },
    filteredList() {
      let sortedArray = this.pools;
      if (this.search.length !== 0) {
        sortedArray = sortedArray.filter((pool) => {
          return pool.name.toLowerCase().includes(this.search.toLowerCase());
        });
      }
      if (this.sortParam === "Liquidation fee") {
        return sortedArray.sort(this.sortByFee);
      }
      if (this.sortParam === "NXUSD borrowed") {
        return sortedArray.sort(this.sortByTVL);
      }
      if (this.sortParam === "NXUSD left") {
        return sortedArray.sort(this.sortByNXUSDleft);
      }
      return sortedArray.sort(this.sortByTitle);
    },
  },
  methods: {
    sortByFee(d1, d2) {
      return d1.stabilityFee < d2.stabilityFee ? 1 : -1;
    },
    sortByNXUSDleft(d1, d2) {
      return Number(d1.dynamicBorrowAmount) < Number(d2.dynamicBorrowAmount)
        ? 1
        : -1;
    },
    sortByTitle(d1, d2) {
      return d1.name > d2.name ? 1 : -1;
    },
    sortByTVL(d1, d2) {
      let borrowD1 = parseFloat(
        this.$ethers.utils.formatEther(
          this.$store.getters.getTotalBorrow(d1.id)
        )
      );

      let borrowD2 = parseFloat(
        this.$ethers.utils.formatEther(
          this.$store.getters.getTotalBorrow(d2.id)
        )
      );
      return Number(borrowD1) < Number(borrowD2) ? 1 : -1;
    },
    setSortParam(sortParam) {
      this.sortParam = sortParam;
    },
    async walletBtnHandler() {
      if (this.isConnected) {
        return false;
      }

      this.$store.commit("setPopupState", {
        type: "connectWallet",
        isShow: true,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.stand-view {
  padding: 40px 0;
  position: relative;
  flex: 1;
  .stand-group {
    position: relative;
    z-index: 2;
    h1 {
      text-align: left;
      margin-bottom: 24px;
      font-size: 32px;
      line-height: 36px;
    }
  }
}
.stand-action-view {
  position: relative;
  flex: 1;
  background: #1c1c1c;
}
.stand-container {
  display: flex;
  flex-direction: row;
}
.search-input {
  background: #353535 url(../assets/images/search-icon.svg) 98% center no-repeat;
  display: flex;
  height: 32px;
  width: 160px;
  border: 1px solid #8a8a8a;
  box-sizing: border-box;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  padding: 8px;
  margin-bottom: 32px;
  margin-right: 12px;
  transition: 0.15s all ease-in-out;
  color: #8a8a8a;
  &:focus {
    outline: none;
    transform: scale(1.05);
    color: white;
  }
}
.stand-sort select {
  background: #353535 url(../assets/images/arrow-list.svg) 98% center no-repeat;
  appearance: none;
  color: #8a8a8a;
  display: flex;
  flex-direction: row;
  height: 32px;
  width: 160px;
  border: 1px solid #8a8a8a;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 24px;
  font-size: 12px;
  cursor: pointer;
  &:focus {
    background: #1c1c1c;
  }
}
.select-item {
  color: white;
  font-size: 12px;
  background: #262626;
  cursor: pointer;
  :hover {
    background-color: #1c1c1c;
  }
}

.notExist {
  margin: 64px 0 88px 0;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
}
@media screen and(max-width: 980px) {
  .stand-view .stand-group:first-child {
    padding-top: 30px;
  }
}
@media screen and(max-width: 780px) {
}
@media screen and(max-width: 640px) {
  .stand-view .stand-group h1 {
    margin-bottom: 30px;
  }
  .stand-view {
    padding-bottom: 100px;
  }
}
</style>
