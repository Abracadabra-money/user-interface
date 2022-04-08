<template>
  <div class="leverage-bar">
    <p class="bar-title">Choose your leverage</p>

    <div class="bar-wrap">
      <div class="multipliers-wrap">
        <div
          v-for="multiplierItem in multipliers"
          :key="multiplierItem"
          class="multiplier-item"
          :class="{ active: multiplierItem === multiplier }"
          @click="setActive(multiplierItem)"
        >
          <p>{{ multiplierItem }}x</p>

<!--          <transition name="fade">-->
<!--            <img-->
<!--              v-if="multiplierItem === 10 && multiplierItem === multiplier"-->
<!--              src="@/assets/images/dani-mac.svg"-->
<!--              alt=""-->
<!--              class="dani-mac"-->
<!--            />-->
<!--          </transition>-->
        </div>
      </div>

      <div class="range-track">
        <div
          class="range"
          :class="userRisk"
          :style="{ width: `${rangeWidth}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    multiplier: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      multipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  },
  computed: {
    userRisk() {
      if (this.multiplier > 7) return "hight";
      if (this.multiplier > 3) return "medium";

      return "safe";
    },
    rangeWidth() {
      if (this.multiplier === 1) {
        return 0;
      }

      const max = this.multipliers.length - 1;
      const value = this.multiplier - 1;

      return (value / max) * 100;
    },
  },
  methods: {
    setActive(val) {
      this.$emit("update", val);
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes look_aside {
  from {
    transform: translateX(-50%) scaleX(-1);
  }
  to {
    transform: translateX(-50%) scaleX(1);
  }
}

.leverage-bar {
  .bar-title {
    text-align: left;
  }

  .bar-wrap {
    margin-top: 20px;
  }

  .multipliers-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .multiplier-item {
      position: relative;

      .dani-mac {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%) scaleX(-1);
        width: 30px;
        height: auto;
        animation: 3s linear 1s 2 alternate look_aside;
      }

      &:hover,
      &.active {
        p {
          color: #E7FC6E;
        }
      }

      p {
        transition: all 0.3s ease;
        cursor: pointer;
      }
    }
  }

  .range-track {
    background: #606060;
    border-radius: 4px;
    display: flex;
    height: 12px;

    .range {
      height: 100%;
      width: 39%;
      border-radius: 39px;
      transition: all 0.3s ease;

      &.safe {
        background: #FDD33F;
      }

      &.medium {
        background: #FDD33F;
      }

      &.hight {
        background: #FDD33F;
      }
    }
  }
}
</style>
