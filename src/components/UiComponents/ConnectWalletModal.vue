<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header"> Choose provider </slot>
        <img
          class="btn-close"
          src="@/assets/images/cross.svg"
          alt="cross"
          @click="closeModal"
        />
      </header>
      <slot name="body">
        <div
          v-for="connector in connectors"
          :key="connector.name"
          class="modal-body"
        >
          <div
            class="provider-btn"
            @click="connector.onClick()"
            v-if="!connector.disabled"
          >
            <div>{{ connector.name }}</div>
            <img
              :src="require(`@/assets/images/${connector.iconName}.svg`)"
              class="connector-img"
              :alt="connector.name"
            />
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "Modal",
  data() {
    return {
      itsHover: false,
      connectLoader: false,
      btnText: "Connect",
      connectors: [
        {
          iconName: "MetaMask_Fox",
          name: "Metamask",
          onClick: () => this.useConnector("connectMetamask"),
          disabled: !window.ethereum,
        },
        {
          iconName: "WalletConnect-icon",
          name: "WalletConnect",
          onClick: () => this.useConnector("connectWalletConnect"),
          disabled: false,
        },
      ],
    };
  },
  methods: {
    closeModal() {
      this.$store.commit("closePopups");
    },
    async useConnector(connector) {
      try {
        await this.$store.dispatch(connector);
        this.closeModal();
      } catch (e) {
        console.log("e:", e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  padding: 32px;
  background-color: #262626;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  //width: 30vw;
  //height: 26vh;
  min-height: 265px;
  min-width: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-header {
  position: relative;
  margin-bottom: 20px;
  color: white;
  font-size: 20px;
  line-height: 28px;
  justify-content: space-between;
}

.modal-body {
  display: flex;
  flex-direction: column;
  color: #4aae9b;
  position: relative;
  padding: 8px 40px;
}

.btn-close {
  width: 15px;
  position: absolute;
  top: 2px;
  right: 10px;
  cursor: pointer;
}

.provider-btn {
  top: 6px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  background-color: #606060;
  height: 56px;
  img {
    width: 40px;
    margin-right: 24px;
  }
  div {
    margin-left: 24px;
  }
}

.provider-btn:hover {
  filter: brightness(90%);
}
</style>
