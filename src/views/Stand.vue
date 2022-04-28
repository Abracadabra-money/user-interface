<template>
  <div v-if="isConnected" className="stand-view">
    <div className="container mini">
      <div className="stand-group">
        <h1>NXUSD Markets</h1>
        <div className="search-container">
          <input className="search-input" type="text" v-model="search" placeholder="Search" />
        </div>
        <StandTable :tableType="2" :items="filteredList" />
      </div>
    </div>
  </div>
  <div v-else className="stand-action-view">
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
const ActionComponent = () => import("@/components/UiComponents/ActionComponent");

export default {
  data() {
    return {
      text: "Please connect your wallet",
      name: "Connect",
      disabledStatus: false,
      search: '',
    }
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
      if (this.search.length !== 0) {
        return this.pools.filter(pool => {
          return pool.name.toLowerCase().includes(this.search.toLowerCase())
        })
      } else
        return this.pools;
    },
  },
  methods: {
    async walletBtnHandler() {
      if (this.isConnected || !window.ethereum) {
        return false;
      }

      this.disabledStatus = true;

      try {
        await this.$store.dispatch("connectAccount", window.ethereum);
      } catch (e) {
        console.log("e:", e);
      }

      this.disabledStatus = false;
    }
  },
};
</script>

<style lang="scss" scoped>
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
  background: #1C1C1C;
}

.search-input {
  background: #353535 url(../assets/images/search-icon.svg) 98% center no-repeat;
  display: flex;
  height: 32px;
  width: 160px;
  border: 1px solid #8A8A8A;
  box-sizing: border-box;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  padding: 8px;

  margin-bottom: 32px;
  margin-right: 12px;

  transition: .15s all ease-in-out;

  &:focus {
    outline: none;
    transform: scale(1.05);
    color: white;
  }
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
