import swapInfo from "@/utils/swap/swap.js";

export default {
  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    async initSwap() {
      console.log("SWAP");
      if (!swapInfo) return false;
      if (swapInfo.contractChain !== "0x1") return false;

      const contractInstance = new this.$ethers.Contract(
        swapInfo.contract.address,
        JSON.stringify(swapInfo.contract.abi),
        this.signer
      );

      const rateContract = new this.$ethers.Contract(
        swapInfo.tokensRateContract.address,
        JSON.stringify(swapInfo.tokensRateContract.abi),
        this.signer
      );

      const poolRate = await this.getTokenRate(contractInstance);

      console.log(poolRate);

      const tokens = await Promise.all(
        swapInfo.tokens.map((token) =>
          this.initSwapToken(
            token,
            swapInfo.contract.address,
            poolRate,
            rateContract
          )
        )
      );

      const swapObject = {
        contractInstance,
        rateContract,
        tokens,
      };

      this.$store.commit("setSwapObject", swapObject);
    },
    async initSwapToken(token, allowAddr, poolRate, rateContract) {
      const contractInstance = new this.$ethers.Contract(
        token.address,
        JSON.stringify(token.abi),
        this.signer
      );

      let allowance;

      try {
        const allowanceResp = await contractInstance.allowance(
          this.account,
          allowAddr
        );
        allowance = parseFloat(allowanceResp.toString()) > 0;
      } catch (e) {
        console.log("allowance err:", e);
      }

      const rateIdx = token.tokenIdx - 1;

      if (rateIdx < 0) {
        return {
          ...token,
          contractInstance,
          allowance,
          rate: 1,
        };
      }

      let tokenRate;

      try {
        const rateResp = await rateContract.calc_withdraw_one_coin(
          poolRate,
          rateIdx,
          {
            gasLimit: 600000,
          }
        );

        const parsedRate = this.$ethers.utils.formatUnits(
          rateResp.toString(),
          token.decimals
        );
        tokenRate = parsedRate;
      } catch (e) {
        console.log("token rate err:", e);
      }

      return {
        ...token,
        contractInstance,
        allowance,
        rate: tokenRate,
      };
    },
    async getTokenRate(contract) {
      try {
        // const estimateGas = await contract.get_virtual_price();

        // const gasLimit = 1000 + +estimateGas.toString();
        const amount = this.$ethers.utils.parseUnits("1", 18);

        const rate = await contract["get_dy(int128,int128,uint256)"](
          0,
          1,
          amount
        );

        return rate;
      } catch (e) {
        console.log("getVirtualPrice err:", e);
      }
    },
  },
};
