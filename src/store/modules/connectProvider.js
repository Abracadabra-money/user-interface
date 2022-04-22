import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers, utils } from "ethers";

export default {
  state: {
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    walletProviderName: false,
    isWalletConnected: false,
  },
  mutations: {
    setProvider(state, payload) {
      state.provider = payload;
    },
    setSigner(state, payload) {
      console.log(state, "state");
      state.signer = payload;
    },
    setAccount(state, payload) {
      state.account = payload;
    },
    setChainId(state, payload) {
      state.chainId = payload;
    },
    setWalletConnection(state, payload) {
      state.isWalletConnected = payload;
    },
    setWalletProviderName(state, payload) {
      state.walletProviderName = payload;
    },
  },
  actions: {
    async connectProvider({ commit }) {
      let provider = false;
      if (window.ethereum) {
        provider = await new providers.Web3Provider(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          console.log("setWalletProvider", "Metamask");
          commit("setWalletProviderName", "Metamask");
          commit("setChainId", chainId);
          commit("setAccount", accounts[0]);
          commit("setSigner", signer);
          commit("setWalletConnection", true);
          return signer;
        }
      }
      const walletConnectProvider = new WalletConnectProvider({
        rpc: {
          43113: "https://api.avax-test.network/ext/bc/C/rpc",
          43114: "https://api.avax.network/ext/bc/C/rpc",
        },
      });
      const connector = walletConnectProvider.connector;
      console.log('alletConnectProvider.connected', connector.chainId)
      if (connector.accounts>0) {
        const accounts = await walletConnectProvider.enable()
        console.log('accounts22222', accounts[0])
        provider = new providers.Web3Provider(walletConnectProvider);
        console.log(0);
        const chainId = utils.hexlify(connector.chainId);
        console.log('chainId222',chainId)
        console.log(1);
        const signer = provider.getSigner();
        console.log(2)
        commit("setWalletProviderName", "WalletConnect");
        commit("setChainId", chainId);
        commit("setAccount", accounts[0]);
        commit("setSigner", signer);
        commit("setWalletConnection", true);
        return signer;
      }

      commit("setProvider", provider);
      return provider;
    },

    async fetchMetamaskChain({ commit }, provider) {
      const chainId = await provider.request({ method: "eth_chainId" });

      if (chainId) {
        commit("setChainId", chainId);
        return chainId;
      }

      return false;
    },

    async connectMetamask({ commit }, provider) {
      console.log(1);
      try {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log("Please connect to MetaMask.");
          return false;
        }

        const chainId = await provider.request({ method: "eth_chainId" });

        if (chainId) {
          commit("setChainId", chainId);
          commit("setWalletProviderName", "Metamask");
          commit("setAccount", accounts[0]);
          commit("setWalletConnection", true);
          console.log("finito");
          return true;
        }
        return false;
      } catch (err) {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log("Please connect to WebSite.");
        } else {
          console.error(err);
        }
        return false;
      }
    },
    async connectWalletConnect({ commit }) {
      console.log(1);
      try {
        const walletConnectProvider = new WalletConnectProvider({
          rpc: {
            43113: "https://api.avax-test.network/ext/bc/C/rpc",
            43114: "https://api.avax.network/ext/bc/C/rpc",
          },
        });
        const accounts = await walletConnectProvider.enable();
        const provider = new providers.Web3Provider(walletConnectProvider);
        commit("setProvider", provider);
        const signer = await provider.getSigner();
        commit("setSigner", signer);
        const chainId = utils.hexlify((await provider.getNetwork()).chainId);
        if (chainId) {
          commit("setChainId", chainId);
          commit("setWalletProviderName", "WalletConnect");
          commit("setWalletConnection", true);
          console.log("connectAccount", accounts[0], chainId);
          commit("setAccount", accounts[0]);
          console.log("finito");
          return true;
        }
        return false;
      } catch (err) {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log("Please connect to WebSite.");
        } else {
          console.error(err);
        }
        return false;
      }
    },
    async detectProvider() {
      let provider;
      console.log(1);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log("accounts", accounts);
      if (!provider) {
        const walletConnectProvider = new WalletConnectProvider({
          rpc: {
            43113: "https://api.avax-test.network/ext/bc/C/rpc",
            43114: "https://api.avax.network/ext/bc/C/rpc",
          },
        });
        provider = new providers.Web3Provider(walletConnectProvider);
      }
      return provider;
    },
  },
  getters: {
    getProvider: (state) => state.provider,
    getSigner: (state) => state.signer,
    getAccount: (state) => state.account,
    getChainId: (state) => state.chainId,
    getWalletIsConnected: (state) => state.isWalletConnected,
    getWalletProviderName: (state) => state.walletProviderName,
  },
};
