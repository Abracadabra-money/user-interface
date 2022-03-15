<template>
  <div class="pool-view">
    <div class="container mini">
      <BackButton :text="'Back'" @click="toStand" />

      <h1>Magic happens here</h1>

      <div class="pool-head-bar">
        <div class="btns-group">
          <button
            class="btn mini borrow-btn"
            :class="{ active: actionType === 'borrow' }"
            @click="setActionType('borrow')"
          >
            Borrow
          </button>
          <button
            class="btn mini replay-btn"
            :class="{ active: actionType === 'repay' }"
            @click="setActionType('repay')"
          >
            Repay
          </button>
        </div>

        <template v-if="pool">
          <LiquidationBar :pool="pool" />
        </template>
      </div>

      <div class="pool-content" v-if="pool">
        <BorrowRepayComponent
          :actionType="actionType"
          :balance="pool.userBalance"
          :balanceNativeToken="pool.userBalanceNativeToken"
          :pairBalance="pool.userPairBalance"
          @addAndBorrow="addAndBorrowHandler"
          @addCollateral="addCollateralHandler"
          @borrow="borrowHandler"
          @removeAndRepay="removeAndRepayHandler"
          @removeAndRepayMax="removeAndRepayMaxHandler"
          @repay="repayHandler"
          @removeCollateral="removeCollateralHandler"
          @addAndBorrowMultiple="addMultiBorrowHandler"
          @borrowMultiple="addMultiBorrowHandler"
          :isUpdatePrice="pool.askUpdatePrice"
          :tokenName="pool.token.name"
          :tokenToUsd="pool.tokenPrice"
          :tokenDecimals="pool.token.decimals"
          :tokenPair="pool.tokenPairPrice"
          :tokenPairName="pool.pairToken.name"
          :tokenPairDecimals="pool.pairToken.decimals"
          :userTotalCollateral="pool.userCollateralShare"
          :userTotalBorrowed="pool.userBorrowPart"
          :ltv="pool.ltv"
        />

        <CollateralParameters
          :infoItems="collateralInfo"
          :exchangeRate="pool.tokenPrice"
          :tokenName="pool.token.name"
        />

        <Balances :balances="userBalancesProp" />

        <InfoBlock :infoItems="pool.mainInfo" />
      </div>
    </div>
  </div>
</template>

<script>
const BorrowRepayComponent = () =>
  import("@/components/Pool/BorrowRepayComponent");
const CollateralParameters = () =>
  import("@/components/Pool/CollateralParameters");
const Balances = () => import("@/components/Pool/Balances");
const InfoBlock = () => import("@/components/Pool/InfoBlock");
const BackButton = () => import("@/components/UiComponents/BackButton");
const LiquidationBar = () => import("@/components/Pool/LiquidationBar");

export default {
  data() {
    return {
      actionType: "borrow",
      // pool: null,
      gasLimitConst: 1000,
    };
  },
  computed: {
    collateralInfo() {
      return this.$store.getters.getCollateralInfo;
    },
    userBalancesProp() {
      const pool = this.pool;
      const balances = [
        {
          balance: this.userBalanceNativeToken,
          token: "AVAX",
          decimals: "18",
        },
        {
          balance: this.userBalanceToken,
          token: pool.token.name,
          decimals: pool.token.decimals.toString(),
        },
        {
          balance: this.userBalancePairToken,
          token: pool.pairToken.name,
          decimals: pool.pairToken.decimals.toString(),
        },
      ];
      if (pool.name !== "AVAX") {
        const filterBalances = balances.slice(1);
        return filterBalances;
      } else {
        return balances;
      }
    },
    userBalanceNativeToken() {
      return this.$store.getters.getBalanceNativeToken;
    },
    userBalanceToken() {
      return this.$store.getters.getBalanceToken;
    },
    userBalancePairToken() {
      return this.$store.getters.getBalancePairToken;
    },
    pool() {
      const poolId = this.$route.params.id;
      return this.$store.getters.getPoolById(poolId);
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAccount;
    },
    useAVAX() {
      return this.$store.getters.getUseAVAX;
    },
  },
  methods: {
    async wrapperStatusTx(result) {
      const status = await result.wait();
      if (status) {
        await this.updateBalancesAndCollateralInfo();
      }
    },
    async updateBalancesAndCollateralInfo() {
      this.useAVAX
        ? await this.$store.dispatch("checkBalanceNativeToken")
        : await this.$store.dispatch(
            "checkBalanceToken",
            this.pool.token.contract
          );
      await this.$store.dispatch(
        "checkBalancePairToken",
        this.pool.pairTokenContract
      );
      await this.checkCollateralInfo();
    },
    async checkCollateralInfo() {
      this.$store.commit("setTokenPrice", this.pool.tokenPrice);
      await this.$store.dispatch(
        "setUserCollateralShare",
        this.pool.contractInstance,
        this.pool.token.decimals
      );
      await this.$store.dispatch(
        "setUserBorrowPart",
        this.pool.contractInstance
      );
      this.$store.dispatch("createCollateralInfo");
    },
    getAVAXStatus() {
      return this.$store.getters.getUseAVAX;
    },
    setActionType(type) {
      if (type !== this.actionType) this.actionType = type;
    },
    toStand() {
      this.$router.push({ name: "Stand" });
    },
    async addMultiBorrowHandler(data) {
      console.log("ADD COLL OR/AND BORROW -MULTI- HANDLER", data);

      let isTokenToCookApprove = await this.isTokenApprowed(
        this.pool.token.contract,
        this.pool.masterContractInstance.address
      );

      if (!isTokenToCookApprove) {
        isTokenToCookApprove = await this.approveToken(
          this.pool.token.contract,
          this.pool.masterContractInstance.address
        );
      }

      let isTokenToSwapApprove = await this.isTokenApprowed(
        this.pool.token.contract,
        this.pool.swapContract.address
      );

      if (!isTokenToSwapApprove) {
        isTokenToSwapApprove = await this.approveToken(
          this.pool.token.contract,
          this.pool.swapContract.address
        );
      }

      let isPairTokenToSwapApprove = await this.isTokenApprowed(
        this.pool.pairTokenContract,
        this.pool.swapContract.address
      );

      if (!isPairTokenToSwapApprove) {
        isPairTokenToSwapApprove = await this.approveToken(
          this.pool.pairTokenContract,
          this.pool.swapContract.address
        );
      }

      const isApprowed = await this.isApprowed();

      if (
        isTokenToCookApprove &&
        isTokenToSwapApprove &&
        isPairTokenToSwapApprove
      ) {
        this.cookMultiBorrow(data, isApprowed);
        return false;
      }
    },
    async addAndBorrowHandler(data) {
      console.log("ADD COLL & BORROW HANDLER", data);
      const useAVAXStatus = this.getAVAXStatus();
      const isApprowed = await this.isApprowed();

      if (useAVAXStatus) {
        this.cookAddAndBorrow(data, isApprowed);
      } else {
        const isTokenApprove = await this.isTokenApprowed(
          this.pool.token.contract,
          this.pool.masterContractInstance.address
        );

        if (isTokenApprove) {
          this.cookAddAndBorrow(data, isApprowed);
          return false;
        }

        const approveResult = await this.approveToken(
          this.pool.token.contract,
          this.pool.masterContractInstance.address
        );
        if (approveResult) this.cookAddAndBorrow(data, isApprowed);
      }
    },
    async addCollateralHandler(data) {
      console.log("ADD COL HANDLER", data);
      const useAVAXStatus = this.getAVAXStatus();
      const isApprowed = await this.isApprowed();

      if (useAVAXStatus) {
        this.cookAddCollateral(data, isApprowed);
      } else {
        const isTokenApprove = await this.isTokenApprowed(
          this.pool.token.contract,
          this.pool.masterContractInstance.address
        );

        if (isTokenApprove) {
          this.cookAddCollateral(data, isApprowed);
          return false;
        }

        const approveResult = await this.approveToken(
          this.pool.token.contract,
          this.pool.masterContractInstance.address
        );
        if (approveResult) this.cookAddCollateral(data, isApprowed);
      }
    },
    async borrowHandler(data) {
      console.log("BORROW HANDLER", data);
      const isApprowed = await this.isApprowed();

      if (isApprowed) {
        this.cookBorrow(data, isApprowed);
      }
    },
    async removeAndRepayHandler(data) {
      console.log("REMOVE & REPAY HANDLER", data);

      const isTokenApprowed = await this.isTokenApprowed(
        this.pool.pairTokenContract,
        this.pool.masterContractInstance.address
      );

      const isApprowed = await this.isApprowed();

      if (isTokenApprowed) {
        this.cookRemoveAndRepay(data, isApprowed);
        return false;
      }

      const approveResult = await this.approveToken(
        this.pool.pairTokenContract,
        this.pool.masterContractInstance.address
      );
      if (approveResult) this.cookRemoveAndRepay(data, isApprowed);
    },
    async repayHandler(data) {
      console.log("REPAY HANDLER", data);

      const isTokenApprowed = await this.isTokenApprowed(
        this.pool.pairTokenContract,
        this.pool.masterContractInstance.address
      );

      const isApprowed = await this.isApprowed();

      if (isTokenApprowed) {
        this.cookRepay(data, isApprowed);
        return false;
      }

      const approveResult = await this.approveToken(
        this.pool.pairTokenContract,
        this.pool.masterContractInstance.address
      );
      if (approveResult) this.cookRepay(data, isApprowed);
    },
    async removeCollateralHandler(data) {
      console.log("REMOVE COLLATERAL HANDLER", data);

      const isApprowed = await this.isApprowed();
      this.cookRemoveCollateral(data, isApprowed);
    },
    async removeAndRepayMaxHandler(data) {
      console.log("REMOVE & REPAY MAX HANDLER", data);

      const isTokenApprowed = await this.isTokenApprowed(
        this.pool.pairTokenContract,
        this.pool.masterContractInstance.address
      );

      const isApprowed = await this.isApprowed();

      if (isTokenApprowed) {
        this.cookRemoveAndRepayMax(data, isApprowed);
        return false;
      }

      const approveResult = await this.approveToken(
        this.pool.pairTokenContract,
        this.pool.masterContractInstance.address
      );
      if (approveResult) this.cookRemoveAndRepayMax(data, isApprowed);
    },
    async cookRemoveAndRepayMax(
      { amount, collateralAmount, updatePrice },
      isApprowed
    ) {
      const account = this.account;
      const pairToken = this.pool.pairToken.address;

      // 20
      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, account, "0x00", "-0x01"]
      );
      // 6
      const getRepayShareEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256"],
        [collateralAmount]
      );
      // 2
      const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        [collateralAmount, account, false]
      );
      // 4
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, account]
      );
      // 21
      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [
          this.pool.token.address, //token addres !!
          account,
          "0x00",
          amount,
        ]
      );

      const gasPrice = await this.getGasPrice();
      console.log("GAS PRICE:", gasPrice);

      if (isApprowed) {
        console.log("APPROWED");

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 6, 20, 2, 4, 21],
            [0, 0, 0, 0, 0, 0],
            [
              updateEncode,
              getRepayShareEncode,
              depositEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 6, 20, 2, 4, 21],
            [0, 0, 0, 0, 0, 0],
            [
              updateEncode,
              getRepayShareEncode,
              depositEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [6, 20, 2, 4, 21],
          [0, 0, 0, 0, 0],
          [
            getRepayShareEncode,
            depositEncode,
            repayEncode,
            removeCollateral,
            bentoWithdrawEncode,
          ],
          {
            value: "0",
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [6, 20, 2, 4, 21],
          [0, 0, 0, 0, 0],
          [
            getRepayShareEncode,
            depositEncode,
            repayEncode,
            removeCollateral,
            bentoWithdrawEncode,
          ],
          {
            value: "0",
            gasLimit,
          }
        );

        console.log(result);
      } else {
        console.log("NOT APPROWED");
        const approvalEncode = await this.getApprovalEncode();

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract();

          console.log("approveMasterContract resp: ", approvalMaster);

          if (!approvalMaster) return false;

          if (updatePrice) {
            const updateEncode = this.getUpdateRateEncode();

            const estimateGas =
              await this.pool.contractInstance.estimateGas.cook(
                [11, 6, 20, 2, 4, 21],
                [0, 0, 0, 0, 0, 0],
                [
                  updateEncode,
                  getRepayShareEncode,
                  depositEncode,
                  repayEncode,
                  removeCollateral,
                  bentoWithdrawEncode,
                ],
                {
                  value: "0",
                  // gasPrice,
                  // gasLimit: 1000000,
                }
              );

            const gasLimit = this.gasLimitConst + +estimateGas.toString();

            console.log("gasLimit:", gasLimit);

            const result = await this.pool.contractInstance.cook(
              [11, 6, 20, 2, 4, 21],
              [0, 0, 0, 0, 0, 0],
              [
                updateEncode,
                getRepayShareEncode,
                depositEncode,
                repayEncode,
                removeCollateral,
                bentoWithdrawEncode,
              ],
              {
                value: "0",
                // gasPrice,
                gasLimit,
              }
            );

            console.log(result);
            return false;
          }

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [6, 20, 2, 4, 21],
            [0, 0, 0, 0, 0],
            [
              getRepayShareEncode,
              depositEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [6, 20, 2, 4, 21],
            [0, 0, 0, 0, 0],
            [
              getRepayShareEncode,
              depositEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          console.log(result);

          return false;
        }

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [24, 11, 6, 20, 2, 4, 21],
            [0, 0, 0, 0, 0, 0, 0],
            [
              approvalEncode,
              updateEncode,
              getRepayShareEncode,
              depositEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [24, 11, 6, 20, 2, 4, 21],
            [0, 0, 0, 0, 0, 0, 0],
            [
              approvalEncode,
              updateEncode,
              getRepayShareEncode,
              depositEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [24, 6, 20, 2, 4, 21],
          [0, 0, 0, 0, 0, 0],
          [
            approvalEncode,
            getRepayShareEncode,
            depositEncode,
            repayEncode,
            removeCollateral,
            bentoWithdrawEncode,
          ],
          {
            value: "0",
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [24, 6, 20, 2, 4, 21],
          [0, 0, 0, 0, 0, 0],
          [
            approvalEncode,
            getRepayShareEncode,
            depositEncode,
            repayEncode,
            removeCollateral,
            bentoWithdrawEncode,
          ],
          {
            value: "0",
            // gasPrice,
            gasLimit,
          }
        );

        console.log(result);
      }
    },
    async cookRepay({ amount, updatePrice }, isApprowed) {
      const account = this.account;
      const pairToken = this.pool.pairToken.address;

      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, account, amount, "0x0"]
      );

      const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256"],
        ["-0x01"]
      );

      const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-0x01", account, false]
      );

      const gasPrice = await this.getGasPrice();
      console.log("GAS PRICE:", gasPrice);

      if (isApprowed) {
        console.log("APPROWED");

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 20, 7, 2],
            [0, 0, 0, 0],
            [updateEncode, depositEncode, getRepayPartEncode, repayEncode],
            {
              value: "0",
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 20, 7, 2],
            [0, 0, 0, 0],
            [updateEncode, depositEncode, getRepayPartEncode, repayEncode],
            {
              value: "0",
              gasLimit,
            }
          );
          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [20, 7, 2],
          [0, 0, 0],
          [depositEncode, getRepayPartEncode, repayEncode],
          {
            value: "0",
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [20, 7, 2],
          [0, 0, 0],
          [depositEncode, getRepayPartEncode, repayEncode],
          {
            value: "0",
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
      } else {
        console.log("NOT APPROWED");
        const approvalEncode = await this.getApprovalEncode();

        console.log("approvalEncode result:", approvalEncode);

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract();

          console.log("approveMasterContract resp: ", approvalMaster);

          if (!approvalMaster) return false;

          if (updatePrice) {
            const updateEncode = this.getUpdateRateEncode();

            const estimateGas =
              await this.pool.contractInstance.estimateGas.cook(
                [11, 20, 7, 2],
                [0, 0, 0, 0],
                [updateEncode, depositEncode, getRepayPartEncode, repayEncode],
                {
                  value: "0",
                  // gasPrice,
                  // gasLimit: 1000000,
                }
              );

            const gasLimit = this.gasLimitConst + +estimateGas.toString();

            console.log("gasLimit:", gasLimit);

            const result = await this.pool.contractInstance.cook(
              [11, 20, 7, 2],
              [0, 0, 0, 0],
              [updateEncode, depositEncode, getRepayPartEncode, repayEncode],
              {
                value: "0",
                // gasPrice,
                gasLimit,
              }
            );

            await this.wrapperStatusTx(result);

            console.log(result);
            return false;
          }

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [20, 7, 2],
            [0, 0, 0],
            [depositEncode, getRepayPartEncode, repayEncode],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [20, 7, 2],
            [0, 0, 0],
            [depositEncode, getRepayPartEncode, repayEncode],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [24, 11, 20, 7, 2],
            [0, 0, 0, 0, 0],
            [
              approvalEncode,
              updateEncode,
              depositEncode,
              getRepayPartEncode,
              repayEncode,
            ],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [24, 11, 20, 7, 2],
            [0, 0, 0, 0, 0],
            [
              approvalEncode,
              updateEncode,
              depositEncode,
              getRepayPartEncode,
              repayEncode,
            ],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [24, 20, 7, 2],
          [0, 0, 0, 0],
          [approvalEncode, depositEncode, getRepayPartEncode, repayEncode],
          {
            value: "0",
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [24, 20, 7, 2],
          [0, 0, 0, 0],
          [approvalEncode, depositEncode, getRepayPartEncode, repayEncode],
          {
            value: "0",
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
      }
    },
    async cookRemoveCollateral({ amount, updatePrice }, isApprowed) {
      const withdrawAddressToken = this.getAVAXStatus()
        ? "0x0000000000000000000000000000000000000000"
        : this.pool.token.address;
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, this.account]
      );

      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [withdrawAddressToken, this.account, "0x00", amount]
      );

      const gasPrice = await this.getGasPrice();
      console.log("GAS PRICE:", gasPrice);

      if (isApprowed) {
        console.log("APPROWED");

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 4, 21],
            [0, 0, 0],
            [updateEncode, removeCollateral, bentoWithdrawEncode],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 4, 21],
            [0, 0, 0],
            [updateEncode, removeCollateral, bentoWithdrawEncode],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [4, 21],
          [0, 0],
          [removeCollateral, bentoWithdrawEncode],
          {
            value: "0",
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [4, 21],
          [0, 0],
          [removeCollateral, bentoWithdrawEncode],
          {
            value: "0",
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
      } else {
        console.log("NOT APPROWED");
        const approvalEncode = await this.getApprovalEncode();

        console.log("approvalEncode result:", approvalEncode);

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract();

          console.log("approveMasterContract resp: ", approvalMaster);

          if (!approvalMaster) return false;

          if (updatePrice) {
            const updateEncode = this.getUpdateRateEncode();

            const estimateGas =
              await this.pool.contractInstance.estimateGas.cook(
                [11, 4, 21],
                [0, 0, 0],
                [updateEncode, removeCollateral, bentoWithdrawEncode],
                {
                  value: "0",
                  // gasPrice,
                  // gasLimit: 1000000,
                }
              );

            const gasLimit = this.gasLimitConst + +estimateGas.toString();

            console.log("gasLimit:", gasLimit);

            const result = await this.pool.contractInstance.cook(
              [11, 4, 21],
              [0, 0, 0],
              [updateEncode, removeCollateral, bentoWithdrawEncode],
              {
                value: "0",
                // gasPrice,
                gasLimit,
              }
            );

            await this.wrapperStatusTx(result);

            console.log(result);
            return false;
          }

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [4, 21],
            [0, 0],
            [removeCollateral, bentoWithdrawEncode],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [4, 21],
            [0, 0],
            [removeCollateral, bentoWithdrawEncode],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);

          return false;
        }

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [24, 11, 4, 21],
            [0, 0, 0, 0],
            [
              approvalEncode,
              updateEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [24, 11, 4, 21],
            [0, 0, 0, 0],
            [
              approvalEncode,
              updateEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [24, 4, 21],
          [0, 0, 0],
          [approvalEncode, removeCollateral, bentoWithdrawEncode],
          {
            value: "0",
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [24, 4, 21],
          [0, 0, 0],
          [approvalEncode, removeCollateral, bentoWithdrawEncode],
          {
            value: "0",
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
      }
    },
    async cookRemoveAndRepay(
      { amount, collateralAmount, updatePrice },
      isApprowed
    ) {
      const account = this.account;
      const pairToken = this.pool.pairToken.address;

      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, account, collateralAmount, "0x0"]
      );

      const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256"],
        ["-0x01"]
      );

      const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-0x01", account, false]
      );

      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, account]
      );

      const withdrawAddressToken = this.getAVAXStatus()
        ? "0x0000000000000000000000000000000000000000"
        : this.pool.token.address;

      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [
          withdrawAddressToken, //token addres !!
          account,
          "0x00",
          amount,
        ]
      );

      const gasPrice = await this.getGasPrice();
      console.log("GAS PRICE:", gasPrice);

      if (isApprowed) {
        console.log("APPROWED");

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 20, 7, 2, 4, 21],
            [0, 0, 0, 0, 0, 0],
            [
              updateEncode,
              depositEncode,
              getRepayPartEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 20, 7, 2, 4, 21],
            [0, 0, 0, 0, 0, 0],
            [
              updateEncode,
              depositEncode,
              getRepayPartEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [20, 7, 2, 4, 21],
          [0, 0, 0, 0, 0],
          [
            depositEncode,
            getRepayPartEncode,
            repayEncode,
            removeCollateral,
            bentoWithdrawEncode,
          ],
          {
            value: "0",
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [20, 7, 2, 4, 21],
          [0, 0, 0, 0, 0],
          [
            depositEncode,
            getRepayPartEncode,
            repayEncode,
            removeCollateral,
            bentoWithdrawEncode,
          ],
          {
            value: "0",
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
      } else {
        console.log("NOT APPROWED");
        const approvalEncode = await this.getApprovalEncode();

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract();

          console.log("approveMasterContract resp: ", approvalMaster);

          if (!approvalMaster) return false;

          if (updatePrice) {
            const updateEncode = this.getUpdateRateEncode();

            const estimateGas =
              await this.pool.contractInstance.estimateGas.cook(
                [11, 20, 7, 2, 4, 21],
                [0, 0, 0, 0, 0, 0],
                [
                  updateEncode,
                  depositEncode,
                  getRepayPartEncode,
                  repayEncode,
                  removeCollateral,
                  bentoWithdrawEncode,
                ],
                {
                  value: "0",
                  // gasPrice,
                  // gasLimit: 1000000,
                }
              );

            const gasLimit = this.gasLimitConst + +estimateGas.toString();

            console.log("gasLimit:", gasLimit);

            const result = await this.pool.contractInstance.cook(
              [11, 20, 7, 2, 4, 21],
              [0, 0, 0, 0, 0, 0],
              [
                updateEncode,
                depositEncode,
                getRepayPartEncode,
                repayEncode,
                removeCollateral,
                bentoWithdrawEncode,
              ],
              {
                value: "0",
                // gasPrice,
                gasLimit,
              }
            );

            await this.wrapperStatusTx(result);

            console.log(result);
            return false;
          }

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [20, 7, 2, 4, 21],
            [0, 0, 0, 0, 0],
            [
              depositEncode,
              getRepayPartEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [20, 7, 2, 4, 21],
            [0, 0, 0, 0, 0],
            [
              depositEncode,
              getRepayPartEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);

          return false;
        }

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [24, 11, 20, 7, 2, 4, 21],
            [0, 0, 0, 0, 0, 0, 0],
            [
              approvalEncode,
              updateEncode,
              depositEncode,
              getRepayPartEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [24, 11, 20, 7, 2, 4, 21],
            [0, 0, 0, 0, 0, 0, 0],
            [
              approvalEncode,
              updateEncode,
              depositEncode,
              getRepayPartEncode,
              repayEncode,
              removeCollateral,
              bentoWithdrawEncode,
            ],
            {
              value: "0",
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [24, 20, 7, 2, 4, 21],
          [0, 0, 0, 0, 0, 0],
          [
            approvalEncode,
            depositEncode,
            getRepayPartEncode,
            repayEncode,
            removeCollateral,
            bentoWithdrawEncode,
          ],
          {
            value: "0",
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [24, 20, 7, 2, 4, 21],
          [0, 0, 0, 0, 0, 0],
          [
            approvalEncode,
            depositEncode,
            getRepayPartEncode,
            repayEncode,
            removeCollateral,
            bentoWithdrawEncode,
          ],
          {
            value: "0",
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
      }
    },
    async cookBorrow({ amount, updatePrice }, isApprowed) {
      const borrowEncode = this.getBorrowEncode(amount);
      const bentoWithdrawEncode = this.getBentoWithdrawEncode(amount);

      const gasPrice = await this.getGasPrice();
      console.log("GAS PRICE:", gasPrice);

      if (isApprowed) {
        console.log("APPROWED");

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 5, 21],
            [0, 0, 0],
            [updateEncode, borrowEncode, bentoWithdrawEncode],
            {
              value: 0,
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 5, 21],
            [0, 0, 0],
            [updateEncode, borrowEncode, bentoWithdrawEncode],
            {
              value: 0,
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [5, 21],
          [0, 0],
          [borrowEncode, bentoWithdrawEncode],
          {
            value: 0,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [5, 21],
          [0, 0],
          [borrowEncode, bentoWithdrawEncode],
          {
            value: 0,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
        return false;
      }

      console.log("NOT APPROWED");
      const approvalEncode = await this.getApprovalEncode();

      if (approvalEncode === "ledger") {
        const approvalMaster = await this.approveMasterContract();

        console.log("approveMasterContract resp: ", approvalMaster);

        if (!approvalMaster) return false;

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 5, 21],
            [0, 0, 0],
            [updateEncode, borrowEncode, bentoWithdrawEncode],
            {
              value: 0,
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 5, 21],
            [0, 0, 0],
            [updateEncode, borrowEncode, bentoWithdrawEncode],
            {
              value: 0,
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [5, 21],
          [0, 0],
          [borrowEncode, bentoWithdrawEncode],
          {
            value: 0,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [5, 21],
          [0, 0],
          [borrowEncode, bentoWithdrawEncode],
          {
            value: 0,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);

        return false;
      }

      if (updatePrice) {
        const updateEncode = this.getUpdateRateEncode();

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [24, 11, 5, 21],
          [0, 0, 0, 0],
          [approvalEncode, updateEncode, borrowEncode, bentoWithdrawEncode],
          {
            value: 0,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [24, 11, 5, 21],
          [0, 0, 0, 0],
          [approvalEncode, updateEncode, borrowEncode, bentoWithdrawEncode],
          {
            value: 0,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
        return false;
      }

      const estimateGas = await this.pool.contractInstance.estimateGas.cook(
        [24, 5, 21],
        [0, 0, 0],
        [approvalEncode, borrowEncode, bentoWithdrawEncode],
        {
          value: 0,
          // gasPrice,
          // gasLimit: 1000000,
        }
      );

      const gasLimit = this.gasLimitConst + +estimateGas.toString();

      console.log("gasLimit:", gasLimit);

      const result = await this.pool.contractInstance.cook(
        [24, 5, 21],
        [0, 0, 0],
        [approvalEncode, borrowEncode, bentoWithdrawEncode],
        {
          value: 0,
          // gasPrice,
          gasLimit,
        }
      );

      await this.wrapperStatusTx(result);

      console.log(result);
    },
    async cookAddCollateral({ amount, updatePrice }, isApprowed) {
      const depositEncode = this.getDepositEncode(amount);

      const colateralEncode = this.getAddCollateralEncode();

      const gasPrice = await this.getGasPrice();
      console.log("GAS PRICE:", gasPrice);

      const depositAmount = this.getAVAXStatus() ? amount : 0;

      if (isApprowed) {
        console.log("APPROWED");

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 20, 10],
            [0, depositAmount, 0],
            [updateEncode, depositEncode, colateralEncode],
            {
              value: depositAmount,
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 20, 10],
            [0, depositAmount, 0],
            [updateEncode, depositEncode, colateralEncode],
            {
              value: depositAmount,
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [20, 10],
          [depositAmount, 0],
          [depositEncode, colateralEncode],
          {
            value: depositAmount,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [20, 10],
          [depositAmount, 0],
          [depositEncode, colateralEncode],
          {
            value: depositAmount,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
        return false;
      }

      console.log("NOT APPROWED");
      const approvalEncode = await this.getApprovalEncode();

      console.log("approvalEncode result:", approvalEncode);

      if (approvalEncode === "ledger") {
        const approvalMaster = await this.approveMasterContract();

        console.log("approveMasterContract resp: ", approvalMaster);

        if (!approvalMaster) return false;

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 20, 10],
            [0, depositAmount, 0],
            [updateEncode, depositEncode, colateralEncode],
            {
              value: depositAmount,
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 20, 10],
            [0, depositAmount, 0],
            [updateEncode, depositEncode, colateralEncode],
            {
              value: depositAmount,
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [20, 10],
          [depositAmount, 0],
          [depositEncode, colateralEncode],
          {
            value: depositAmount,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [20, 10],
          [depositAmount, 0],
          [depositEncode, colateralEncode],
          {
            value: depositAmount,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);

        return false;
      }

      if (updatePrice) {
        const updateEncode = this.getUpdateRateEncode();

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [24, 11, 20, 10],
          [0, 0, depositAmount, 0],
          [approvalEncode, updateEncode, depositEncode, colateralEncode],
          {
            value: depositAmount,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [24, 11, 20, 10],
          [0, 0, depositAmount, 0],
          [approvalEncode, updateEncode, depositEncode, colateralEncode],
          {
            value: depositAmount,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
        return false;
      }

      const estimateGas = await this.pool.contractInstance.estimateGas.cook(
        [24, 20, 10],
        [0, depositAmount, 0],
        [approvalEncode, depositEncode, colateralEncode],
        {
          value: depositAmount,
          // gasPrice,
          // gasLimit: 1000000,
        }
      );

      const gasLimit = this.gasLimitConst + +estimateGas.toString();

      console.log("gasLimit:", gasLimit);

      const result = await this.pool.contractInstance.cook(
        [24, 20, 10],
        [0, depositAmount, 0],
        [approvalEncode, depositEncode, colateralEncode],
        {
          value: depositAmount,
          // gasPrice,
          gasLimit,
        }
      );

      await this.wrapperStatusTx(result);

      console.log(result);
    },
    async cookAddAndBorrow(
      { collateralAmount, amount, updatePrice },
      isApprowed
    ) {
      const borrowEncode = this.getBorrowEncode(amount);

      const depositEncode = this.getDepositEncode(collateralAmount);

      const colateralEncode = this.getAddCollateralEncode();

      const bentoWithdrawEncode = this.getBentoWithdrawEncode(amount);

      const gasPrice = await this.getGasPrice();
      console.log("GAS PRICE:", gasPrice);

      const depositCollateralAmount = this.getAVAXStatus()
        ? collateralAmount
        : 0;

      if (isApprowed) {
        console.log("APPROWED");

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 5, 21, 20, 10],
            [0, 0, 0, depositCollateralAmount, 0],
            [
              updateEncode,
              borrowEncode,
              bentoWithdrawEncode,
              depositEncode,
              colateralEncode,
            ],
            {
              value: depositCollateralAmount,
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 5, 21, 20, 10],
            [0, 0, 0, depositCollateralAmount, 0],
            [
              updateEncode,
              borrowEncode,
              bentoWithdrawEncode,
              depositEncode,
              colateralEncode,
            ],
            {
              value: depositCollateralAmount,
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [5, 21, 20, 10],
          [0, 0, depositCollateralAmount, 0],
          [borrowEncode, bentoWithdrawEncode, depositEncode, colateralEncode],
          {
            value: depositCollateralAmount,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [5, 21, 20, 10],
          [0, 0, depositCollateralAmount, 0],
          [borrowEncode, bentoWithdrawEncode, depositEncode, colateralEncode],
          {
            value: depositCollateralAmount,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
        return false;
      }

      console.log("NOT APPROWED");
      const approvalEncode = await this.getApprovalEncode();

      console.log("approvalEncode result:", approvalEncode);

      if (approvalEncode === "ledger") {
        const approvalMaster = await this.approveMasterContract();

        console.log("approveMasterContract resp: ", approvalMaster);

        if (!approvalMaster) return false;

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 5, 21, 20, 10],
            [0, 0, 0, depositCollateralAmount, 0],
            [
              updateEncode,
              borrowEncode,
              bentoWithdrawEncode,
              depositEncode,
              colateralEncode,
            ],
            {
              value: depositCollateralAmount,
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 5, 21, 20, 10],
            [0, 0, 0, depositCollateralAmount, 0],
            [
              updateEncode,
              borrowEncode,
              bentoWithdrawEncode,
              depositEncode,
              colateralEncode,
            ],
            {
              value: depositCollateralAmount,
              // gasPrice,
              gasLimit,
            }
          );

          await this.wrapperStatusTx(result);

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [5, 21, 20, 10],
          [0, 0, depositCollateralAmount, 0],
          [borrowEncode, bentoWithdrawEncode, depositEncode, colateralEncode],
          {
            value: depositCollateralAmount,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [5, 21, 20, 10],
          [0, 0, depositCollateralAmount, 0],
          [borrowEncode, bentoWithdrawEncode, depositEncode, colateralEncode],
          {
            value: depositCollateralAmount,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);

        return false;
      }

      if (updatePrice) {
        const updateEncode = this.getUpdateRateEncode();

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [24, 11, 5, 21, 20, 10],
          [0, 0, 0, 0, depositCollateralAmount, 0],
          [
            approvalEncode,
            updateEncode,
            borrowEncode,
            bentoWithdrawEncode,
            depositEncode,
            colateralEncode,
          ],
          {
            value: depositCollateralAmount,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [24, 11, 5, 21, 20, 10],
          [0, 0, 0, 0, depositCollateralAmount, 0],
          [
            approvalEncode,
            updateEncode,
            borrowEncode,
            bentoWithdrawEncode,
            depositEncode,
            colateralEncode,
          ],
          {
            value: depositCollateralAmount,
            // gasPrice,
            gasLimit,
          }
        );

        await this.wrapperStatusTx(result);

        console.log(result);
        return false;
      }

      const estimateGas = await this.pool.contractInstance.estimateGas.cook(
        [24, 5, 21, 20, 10],
        [0, 0, 0, depositCollateralAmount, 0],
        [
          approvalEncode,
          borrowEncode,
          bentoWithdrawEncode,
          depositEncode,
          colateralEncode,
        ],
        {
          value: depositCollateralAmount,
          // gasPrice,
          // gasLimit: 1000000,
        }
      );

      const gasLimit = this.gasLimitConst + +estimateGas.toString();

      console.log("gasLimit:", gasLimit);

      const result = await this.pool.contractInstance.cook(
        [24, 5, 21, 20, 10],
        [0, 0, 0, depositCollateralAmount, 0],
        [
          approvalEncode,
          borrowEncode,
          bentoWithdrawEncode,
          depositEncode,
          colateralEncode,
        ],
        {
          value: depositCollateralAmount,
          // gasPrice,
          gasLimit,
        }
      );

      await this.wrapperStatusTx(result);

      console.log(result);
    },
    async cookMultiBorrow(
      { collateralAmount, amount, updatePrice, minExpected },
      isApprowed
    ) {
      const tokenAddr = this.pool.token.address;
      const swapperAddres = this.pool.swapContract.address;
      const userAddr = this.account;

      const eventsArray = [];
      const valuesArray = [];
      const datasArray = [];

      if (!isApprowed) {
        const approvalEncode = await this.getApprovalEncode();

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract();
          console.log("approveMasterContract resp: ", approvalMaster);
          if (!approvalMaster) return false;
        } else {
          eventsArray.push(24);
          valuesArray.push(0);
          datasArray.push(approvalEncode);
        }
      }

      if (updatePrice) {
        const updateEncode = this.getUpdateRateEncode();

        eventsArray.push(11);
        valuesArray.push(0);
        datasArray.push(updateEncode);
      }

      //10
      const getCollateralEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-0x02", userAddr, false]
      );

      if (collateralAmount) {
        //20
        const getDepositEncode1 = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "int256", "int256"],
          [tokenAddr, userAddr, collateralAmount, "0"]
        );

        eventsArray.push(20);
        valuesArray.push(0);
        datasArray.push(getDepositEncode1);

        eventsArray.push(10);
        valuesArray.push(0);
        datasArray.push(getCollateralEncode2);
      }

      //5
      const getBorrowSwapperEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, swapperAddres]
      );

      eventsArray.push(5);
      valuesArray.push(0);
      datasArray.push(getBorrowSwapperEncode2);

      const swapStaticTx =
        await this.pool.swapContract.populateTransaction.swap(
          userAddr,
          minExpected,
          0,
          {
            gasLimit: 10000000,
          }
        );

      const swapCallByte = swapStaticTx.data.substr(0, 138);

      console.log("TX", swapCallByte);

      // const parsedAccount = this.account.substr(2);
      // 3c1Cb7D4c0ce0dc72eDc7Ea06acC866e62a8f1d8
      // const callBytes = `0x9f1d0f59000000000000000000000000${parsedAccount}00000000000000000000000000000000000000000000000000000000000186a0`;
      //02710
      //186a0
      // console.log(callBytes);

      //30
      const getCallEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [swapperAddres, swapCallByte, false, true, 2]
      );

      eventsArray.push(30);
      valuesArray.push(0);
      datasArray.push(getCallEncode2);

      eventsArray.push(10);
      valuesArray.push(0);
      datasArray.push(getCollateralEncode2);

      const cookData = {
        events: eventsArray,
        values: valuesArray,
        datas: datasArray,
      };

      console.log("cookData", cookData);

      try {
        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: 0,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit for cook:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: 0,
            gasLimit,
          }
        );

        console.log(result);
      } catch (e) {
        console.log("MULTI COOK ERR:", e.code);

        if (e.code === "UNPREDICTABLE_GAS_LIMIT") {
          const notification = {
            msg: "OMG OMG OMG",
          };

          this.$store.commit("addNotification", notification);
        }
      }
    },
    getBorrowEncode(borrow) {
      return this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [borrow, this.account]
      );
    },
    getDepositEncode(amount) {
      const depositAddressToken = this.getAVAXStatus()
        ? "0x0000000000000000000000000000000000000000"
        : this.pool.token.address;

      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [depositAddressToken, this.account, amount, "0"]
      );
    },
    getUpdateRateEncode() {
      return this.$ethers.utils.defaultAbiCoder.encode(
        ["bool", "uint256", "uint256"],
        [true, "0x00", "0x00"]
      );
    },
    getAddCollateralEncode() {
      return this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-2", this.account, false]
      );
    },
    getBentoWithdrawEncode(amount) {
      const pairToken = this.pool.pairToken.address;

      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, this.account, amount, "0x0"]
      );
    },
    async getApprovalEncode() {
      const account = this.account;

      const verifyingContract = await this.getVerifyingContract();
      const masterContract = await this.getMasterContract();
      const nonce = await this.getNonce();
      const chainId = this.$store.getters.getActiveChain.code;

      const domain = {
        name: "BentoBox V1",
        chainId,
        verifyingContract,
      };

      // The named list of all type definitions
      const types = {
        SetMasterContractApproval: [
          { name: "warning", type: "string" },
          { name: "user", type: "address" },
          { name: "masterContract", type: "address" },
          { name: "approved", type: "bool" },
          { name: "nonce", type: "uint256" },
        ],
      };

      // The data to sign
      const value = {
        warning: "Give FULL access to funds in (and approved to) BentoBox?",
        user: account,
        masterContract,
        approved: true,
        nonce,
      };
      console.log(chainId);

      let signature;

      try {
        signature = await this.signer._signTypedData(domain, types, value);
      } catch (e) {
        console.log("SIG ERR:", e.code);
        if (e.code === -32603) {
          return "ledger";

          // this.$store.commit("setPopupState", {
          //   type: "device-error",
          //   isShow: true,
          // });
        }
        return false;
      }

      // const typedData = {
      //   types: {
      //     EIP712Domain: [
      //       { name: "name", type: "string" },
      //       { name: "chainId", type: "uint256" },
      //       { name: "verifyingContract", type: "address" },
      //     ],
      //     SetMasterContractApproval: [
      //       { name: "warning", type: "string" },
      //       { name: "user", type: "address" },
      //       { name: "masterContract", type: "address" },
      //       { name: "approved", type: "bool" },
      //       { name: "nonce", type: "uint256" },
      //     ],
      //   },
      //   primaryType: "SetMasterContractApproval",
      //   domain: {
      //     name: "BentoBox V1",
      //     chainId,
      //     verifyingContract,
      //   },
      //   message: {
      //     warning: "Give FULL access to funds in (and approved to) BentoBox?",
      //     user: account,
      //     masterContract,
      //     approved: true,
      //     nonce,
      //   },
      // };

      // console.log("SIGNATURE DATA: ", typedData);

      // let signature;
      // try {
      //   signature = await window.ethereum.request({
      //     method: "eth_signTypedData_v4",
      //     params: [account, JSON.stringify(typedData)],
      //     from: [account],
      //   });
      // } catch (e) {
      //   console.log("SIG ERR:", e.code);
      //   //-32603
      //   if (e.code === 4001) {
      //     this.$store.commit("setPopupState", {
      //       type: "device-error",
      //       isShow: true,
      //     });
      //   }

      //   return false;
      // }
      // console.log("SIGNATURE@", signature);
      // console.log(signature1 === signature);
      const parsedSignature = this.parseSignature(signature);

      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "bool", "uint8", "bytes32", "bytes32"],
        [
          account,
          masterContract,
          true,
          parsedSignature.v,
          parsedSignature.r,
          parsedSignature.s,
        ]
      );
    },
    parseSignature(signature) {
      const parsedSignature = signature.substring(2);

      var r = parsedSignature.substring(0, 64);
      var s = parsedSignature.substring(64, 128);
      var v = parsedSignature.substring(128, 130);

      return {
        r: "0x" + r,
        s: "0x" + s,
        v: parseInt(v, 16),
      };
    },
    async getGasPrice() {
      try {
        const gasPrice = await this.signer.getGasPrice();
        return gasPrice;
      } catch (e) {
        console.log("getGasPrice err:", e);
      }
    },
    async getMasterContract() {
      try {
        const masterContract =
          await this.pool.contractInstance.masterContract();
        return masterContract;
      } catch (e) {
        console.log("getMasterContract err:", e);
      }
    },
    async getVerifyingContract() {
      try {
        const verifyingContract = await this.pool.contractInstance.bentoBox();
        return verifyingContract;
      } catch (e) {
        console.log("getVerifyingContract err:", e);
      }
    },
    async isApprowed() {
      try {
        const masterContract = await this.getMasterContract();
        const addressApprowed =
          await this.pool.masterContractInstance.masterContractApproved(
            masterContract,
            this.account
          );
        return addressApprowed;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },
    async isTokenApprowed(tokenContract, spenderAddress) {
      try {
        const addressApprowed = await tokenContract.allowance(
          this.account,
          spenderAddress,
          {
            gasLimit: 1000000,
          }
        );

        console.log(
          "TOKEN APPROVE:",
          addressApprowed,
          parseFloat(addressApprowed.toString()) > 0
        );
        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },
    async approveToken(tokenContract, spenderAddress) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await tokenContract.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        console.log("APPROVE RESP:", receipt);

        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },
    async approveMasterContract() {
      try {
        const masterContract = await this.getMasterContract();

        console.log(
          "approveMasterContract",
          this.account,
          masterContract,
          true,
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String("")
        );

        const tx =
          await this.pool.masterContractInstance.setMasterContractApproval(
            this.account,
            masterContract,
            true,
            this.$ethers.utils.formatBytes32String(""),
            this.$ethers.utils.formatBytes32String(""),
            this.$ethers.utils.formatBytes32String("")
          );

        const receipt = await tx.wait();
        return receipt;
      } catch (e) {
        console.log("approveMasterContract err:", e);
        return false;
      }
    },
    async getNonce() {
      try {
        const nonces = await this.pool.masterContractInstance.nonces(
          this.account
        );

        console.log("NONCE:", nonces.toString());

        return nonces.toString();
      } catch (e) {
        console.log("getNonce err:", e);
      }
    },
    async getTokenPrice(token) {
      const price = await this.$store.dispatch("getTokenPrice", {
        from: token,
        to: "USD",
      });

      return price.USD;
    },
    async updatePrices() {
      this.pool.tokenPrice = await this.getTokenPrice(this.pool.token.name);
      this.pool.tokenPairPrice = await this.getTokenPrice(
        this.pool.pairToken.name
      );

      console.log(
        "PAIR PRICES UPDATE",
        this.pool.tokenPrice,
        this.pool.tokenPairPrice
      );
    },
  },
  async created() {
    const isConnected = this.$store.getters.getWalletIsConnected;

    if (!isConnected) {
      this.$router.push({ name: "Home" });
      alert("Connect wallet first");
      return false;
    }

    const poolId = this.$route.params.id;
    console.log("THIS IS - POOL ID: ", poolId);
    const poolItem = this.$store.getters.getPoolById(poolId);

    if (!poolItem) {
      this.$router.push({ name: "Stand" });
      console.log("POOL IS UNDEFINED");
      return false;
    }

    await this.$store.dispatch("checkBalanceNativeToken");

    console.log("POOL:", poolId);

    if (
      this.$route.query.actionType &&
      (this.$route.query.actionType === "borrow" ||
        this.$route.query.actionType === "repay")
    )
      this.setActionType(this.$route.query.actionType);
  },
  components: {
    BorrowRepayComponent,
    CollateralParameters,
    Balances,
    InfoBlock,
    BackButton,
    LiquidationBar,
  },
};
</script>

<style lang="scss" scoped>
.pool-view {
  padding: 40px 0;
  flex: 1;

  h1 {
    font-size: 32px;
    line-height: 36px;
    text-align: left;
    margin: 40px 0 56px;
  }

  .pool-head-bar {
    margin-bottom: 24px;
    display: grid;
    grid-template-columns: 600px 375px;
    column-gap: 20px;
  }

  .btns-group {
    display: flex;
    align-items: center;
    width: 146px;
    height: 32px;
    background: #262626;
    border-radius: 100px;
    padding: 2px;

    .btn {
      width: 73px;
      height: 28px;
      font-size: 14px;
      line-height: 20px;
      background: #262626;

      &:hover {
        //background-color: $clrBlue5;
      }

      &.borrow-btn {
        //margin-right: 20px;
      }

      &.active {
        color: black;
        background-color: $clrBg3;
      }
    }
  }

  .pool-content {
    display: grid;
    grid-template-columns: 600px 375px;
    column-gap: 20px;
    row-gap: 16px;
  }
}

@media screen and(max-width: 1024px) {
  .pool-view .pool-head-bar {
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
  }

  .pool-view .pool-content {
    grid-template-columns: 100%;
  }

  //.pool-view .btns-group .btn.borrow-btn {
  //  margin: 0 10px;
  //}
  //
  //.pool-view .btns-group .btn {
  //  margin: 0 10px;
  //}
}

@media screen and(max-width: 780px) {
  .pool-view {
    padding-top: 40px;
  }
}

@media screen and(max-width: 640px) {
  .pool-view .btns-group {
    justify-content: center;
    margin-bottom: 30px;
  }

  .pool-view .pool-head-bar {
    display: block;
  }
}
</style>
