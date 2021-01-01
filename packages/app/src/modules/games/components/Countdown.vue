<template>
  <div class="countdown shadow-2xl" v-if="timeLeft > 0">
    <div class="countdown__number">
      {{ Math.round(timeLeft / 1000) }}
    </div>
    <svg>
      <circle
        r="100"
        cx="120"
        cy="120"
        :style="{
          animationDuration: `${timer}ms`,
        }"
      ></circle>
    </svg>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue';

export default {
  props: {
    timer: Number,
  },
  setup(props) {
    const state = reactive({
      timeLeft: undefined,
    });

    let countdown;

    function runCountdown({ timeLeft }) {
      if (!timeLeft) {
        state.timeLeft = undefined;
        return;
      }
      clearInterval(countdown);
      state.timeLeft = timeLeft;
      countdown = setInterval(() => {
        state.timeLeft -= 1000;
        if (state.timeLeft <= 0) {
          state.timeLeft = undefined;
          clearInterval(countdown);
        }
      }, 1000);
    }

    watch(
      () => props.timer,
      (timer) => {
        clearInterval(countdown);
        runCountdown({
          timeLeft: timer,
        });
      },
    );

    onMounted(() => {
      runCountdown({
        timeLeft: props.timer,
      });
    });
    return toRefs(state);
  },
};
</script>

<style lang="scss" scoped>
.countdown {
  margin-top: 100px;
  height: 240px;
  width: 240px;
  text-align: center;
  @apply relative m-auto flex items-center justify-center bg-white rounded-full;

  &__number {
    @apply inline-block font-bold text-green-400 text-6xl;
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
    height: 240px;
    width: 240px;
    transform: rotateY(-180deg) rotateZ(-90deg);
  }

  svg circle {
    stroke-dasharray: 628px;
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 10px;
    stroke: rgb(52, 211, 153);
    fill: none;
    animation: countdown 10s linear forwards;
  }
}

@keyframes countdown {
  from {
    stroke-dashoffset: 0px;
  }
  to {
    stroke-dashoffset: 628px;
  }
}
</style>
