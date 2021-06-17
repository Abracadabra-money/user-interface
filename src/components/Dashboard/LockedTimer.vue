<template>
  <div class="locked-timer">
    <p>Unlock in:</p>
    <div class="timer-wrap">
      <img src="@/assets/images/clock.svg" alt="" class="clock-icon" />
      <span>{{ timerCount }}</span>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    finalTime: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      timeInterval: null,
      timerCount: "",
    };
  },
  methods: {
    buyTimer() {
      return setInterval(() => {
        this.checkDuration();
      }, 1000);
    },
    checkDuration() {
      //console.log("CHECK DURR");
      let end = moment.unix(this.finalTime);
      let start = moment(new Date());

      let duration = end.diff(start);

      let formatDurr = moment.utc(duration).format("HH:mm:ss");
      this.timerCount = formatDurr;
    },
  },
  filters: {
    date: function (value) {
      return moment(value).format("DD.MM.YY - HH:mm:ss");
    },
  },
  mounted() {
    this.acceptByTime = moment(this.finalTime).isBefore(new Date());
    if (!this.acceptByTime) {
      this.checkDuration();
      this.timeInterval = this.buyTimer();
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
};
</script>

<style lang="scss" scoped>
.locked-timer {
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  .timer-wrap {
    display: flex;
    align-items: center;
    margin-left: 5px;
  }

  .clock-icon {
    width: 15px;
    height: 15px;
    object-fit: contain;
    margin-right: 5px;
  }
}
</style>
