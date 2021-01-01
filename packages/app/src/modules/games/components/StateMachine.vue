<template>
  <IdleState v-show="gameState === 'idle'" />
  <StartedState v-show="gameState === 'started'" />
  <FinishedState v-show="gameState === 'finished'" />
</template>

<script>
import { computed, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';

import IdleState from '@/modules/games/components/state/IdleState.vue';
import StartedState from '@/modules/games/components/state/StartedState.vue';
import FinishedState from '@/modules/games/components/state/FinishedState.vue';

export default {
  components: { IdleState, StartedState, FinishedState },
  setup() {
    const store = useStore();

    const state = reactive({
      gameState: computed(() => store.state.games.gameState),
    });

    return toRefs(state);
  },
};
</script>

<style></style>
