<template>
  <button
    class="btn-confirm focus:outline-none relative text-sm font-bold uppercase px-6 py-3 text-white rounded"
    :class="classes"
    type="button"
    @click.stop="confirmAction"
  >
    <div class="w-6 text-white absolute transform top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <svg v-show="loading" class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div :class="{ invisible: loading }">
      <slot v-if="!state.waiting && !state.asked" />
      <span v-else>{{ label }}</span>
      <div v-if="state.waiting" class="btn-confirm__progress" />
    </div>
  </button>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  props: {
    confirmText: {
      type: String,
      default: 'Confirmer',
    },
    waitingText: {
      type: String,
      default: 'Êtes-vous sûr ?',
    },
    variant: String,
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      asked: false,
      waiting: false,
    });

    const classes = computed(() => {
      return {
        'pointer-events-none opacity-60': state.waiting,
        'bg-gray-900 hover:bg-gray-800': !props.variant,
        'bg-red-600 hover:bg-red-500': props.variant === 'error',
        'opacity-60 disabled': props.loading,
      };
    });

    const label = computed(() => {
      if (state.waiting) return props.waitingText;
      return props.confirmText;
    });

    function confirmAction() {
      if (state.waiting || props.loading) return;
      if (!state.asked) {
        state.waiting = true;
        setTimeout(() => {
          state.asked = true;
          state.waiting = false;
        }, 2000);
        return;
      }
      emit('confirm');
    }

    return { state, label, classes, confirmAction };
  },
};
</script>

<style lang="scss" scoped>
.btn-confirm {
  &__progress {
    height: 2px;
    @apply bg-white absolute bottom-0 left-0;
    animation: cooldown 2s linear forwards;
  }
}

@keyframes cooldown {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}
</style>
