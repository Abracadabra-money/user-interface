import mim3poolData from "@/utils/3pool/3poolInfo";

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
    async init3Pool() {
      const chainPool = mim3poolData.find(
        (pool) => pool.poolChain === this.chainId
      );

      if (!chainPool) return false;

      console.log("CREATE 3POOL", chainPool);

      const contractInstance = new this.$ethers.Contract(
        chainPool.contract.address,
        JSON.stringify(chainPool.contract.abi),
        this.signer
      );

      const poolContractInstance = new this.$ethers.Contract(
        chainPool.poolInfo.address,
        JSON.stringify(chainPool.poolInfo.abi),
        this.signer
      );

      const lpTokenContractInstance = new this.$ethers.Contract(
        chainPool.lpToken.address,
        JSON.stringify(chainPool.lpToken.abi),
        this.signer
      );

      const userLpBalance = await this.getUserLpBalance(
        lpTokenContractInstance
      );

      const poolBalances = await this.getPoolBalances(poolContractInstance);

      const tokenRateContract = new this.$ethers.Contract(
        chainPool.tokensRateContract.address,
        JSON.stringify(chainPool.tokensRateContract.abi),
        this.signer
      );

      const tokens = await Promise.all(
        chainPool.tokens.map((token) =>
          this.initPoolToken(
            token,
            chainPool.contract.address,
            tokenRateContract
          )
        )
      );

      const tokenExchangeRate = await this.getTokenRate(poolContractInstance);

      const commonRate = 1 + +tokenExchangeRate;

      const mainPercent = (1 / commonRate) * 100;
      const tokensPercent = (+tokenExchangeRate / commonRate) * 100;

      const commonTokenRate = this.getCommonTokensRate(tokens);

      console.log("commonTokenRate", commonTokenRate);

      const updatedTokens = this.updateTokensRate(
        tokens,
        commonTokenRate,
        mainPercent,
        tokensPercent,
        userLpBalance
      );

      console.log("updatedTokens", updatedTokens);

      const mim3Pool = {
        name: chainPool.name,
        contractInstance,
        poolContractInstance,
        poolAddress: chainPool.poolAddress,
        tokens: updatedTokens,
        poolBalances,
        userLpBalance,
        lpTokenDecimals: chainPool.lpToken.decimals,
      };

      console.log("created mim3Pool pool", mim3Pool);
      this.$store.commit("setMim3Pool", mim3Pool);
    },
    async initPoolToken(tokenInfo, allowAddr, rateContract) {
      const contractInstance = new this.$ethers.Contract(
        tokenInfo.address,
        JSON.stringify(tokenInfo.abi),
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

      const rateIdx = tokenInfo.tokenIdx - 1;

      if (rateIdx < 0) {
        return {
          name: tokenInfo.name,
          tokenIdx: tokenInfo.tokenIdx,
          decimals: tokenInfo.decimals,
          contractInstance,
          allowance,
          tokenRate,
        };
      }

      let tokenRate;

      try {
        const rateResp = await rateContract.balances(rateIdx, {
          gasLimit: 600000,
        });

        const parsedRate = this.$ethers.utils.formatUnits(
          rateResp.toString(),
          tokenInfo.decimals
        );
        tokenRate = parseFloat(parsedRate).toFixed(2);
      } catch (e) {
        console.log("token rate err:", e);
      }

      return {
        name: tokenInfo.name,
        tokenIdx: tokenInfo.tokenIdx,
        decimals: tokenInfo.decimals,
        contractInstance,
        allowance,
        tokenRate,
      };
    },
    async getPoolBalances(contract) {
      try {
        const balances = await contract.get_balances({
          gasLimit: 600000,
        });

        const parsedMain = this.$ethers.utils.formatEther(
          balances[0].toString()
        );

        const parsedTokens = this.$ethers.utils.formatEther(
          balances[1].toString()
        );

        const commonRate = +parsedMain + +parsedTokens;

        const mainPercent = (parsedMain / commonRate) * 100;
        const tokensPercent = (parsedTokens / commonRate) * 100;

        const balancesRate = {
          mainRate: parseFloat(mainPercent).toFixed(2),
          tokensRate: parseFloat(tokensPercent).toFixed(2),
        };

        return balancesRate;
      } catch (e) {
        console.log("getPoolBalances err:", e);
      }
    },
    getCommonTokensRate(tokens) {
      const commonRate = tokens.reduce((accumulator, token) => {
        if (token.tokenIdx === 0) return accumulator + 0;

        const tokenPart = token.tokenRate;

        return accumulator + +tokenPart;
      }, 0);
      return commonRate;
    },
    updateTokensRate(tokens, commonTokenRate, mainRate, tokensRate, lpBalance) {
      return tokens.map((token) => {
        if (token.tokenIdx === 0) {
          console.log(tokensRate, mainRate);
          const tokenRate = (+lpBalance / 100) * mainRate;

          return {
            ...token,
            tokenRate: parseFloat(tokenRate).toFixed(2),
          };
        }

        const tokensCommonRate = (+lpBalance / 100) * tokensRate;

        const tokenPercent = (token.tokenRate / commonTokenRate) * 100;

        const tokenRate = (+tokensCommonRate / 100) * tokenPercent;

        return {
          ...token,
          tokenRate: parseFloat(tokenRate).toFixed(2),
        };
      });
    },
    async getUserLpBalance(contract) {
      try {
        const userBalance = await contract.balanceOf(this.account, {
          gasLimit: 600000,
        });

        const parcedBalance = this.$ethers.utils.formatEther(
          userBalance.toString()
        );

        return parcedBalance;
      } catch (e) {
        console.log("getUserLpBalance err:", e);
      }
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

        const parsedRate = this.$ethers.utils.formatUnits(rate.toString(), 18);

        return parsedRate;
      } catch (e) {
        console.log("getVirtualPrice err:", e);
      }
    },
  },
};
