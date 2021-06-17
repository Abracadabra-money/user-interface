<template>
  <div class="stand-table-head" :class="{ deposit: tableType === 2 }">
    <div v-for="(item, idx) in tableCols" :key="idx" class="table-col">
      <p>{{ item }}</p>
    </div>

    <div class="action-col" v-if="colsGetTitles === 1"></div>
  </div>
</template>

<script>
export default {
  props: {
    tableType: {
      default: 1,
    },
  },
  data() {
    return {
      colsGetTitles: ["Pool", "~Yield per $1000", "ROI Annually", "TVL"],
      colsLostTitles: [
        "COMPONENT",
        "TVL",
        "left to borrow",
        "Interest",
        "LIQUIDATION FEE",
      ],
    };
  },
  computed: {
    tableCols() {
      return this.tableType === 2 ? this.colsLostTitles : this.colsGetTitles;
    },
  },
};
</script>

<style scoped lang="scss">
.stand-table-head {
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background-color: $clrBg2;
  border-radius: 12px;
  margin-bottom: 10px;

  .action-col {
    width: 150px;
    padding-left: 30px;
  }

  .table-col {
    width: calc((100% - 150px) / 4);
    text-align: left;

    p {
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.065em;
      max-width: 120px;
    }
  }
}

@media screen and(max-width: 780px) {
  .stand-table-head .action-col {
    display: none;
  }

  .stand-table-head .table-col {
    width: 25%;
  }
}

@media screen and(max-width: 640px) {
  .stand-table-head {
    padding-left: 10px;
    padding-right: 10px;

    .table-col {
      width: 20%;
      p {
        font-size: 10px;
      }
    }
  }
}
</style>
