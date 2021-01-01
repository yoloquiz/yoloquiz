<template>
  <div v-if="quiz" class="w-full items-center bg-gray-900 text-white flex py-2 px-4 justify-between">
    <router-link to="/" class="text-xl font-light">
      {{ quiz.name }}
    </router-link>

    <div class="text-sm">
      <i class="fas fa-users"></i>
      {{ players.length }} en ligne
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const state = reactive({
      players: computed(() => store.state.games.players),
      quiz: computed(() => store.state.games.quiz),
    });

    return toRefs(state);
  },
};
</script>

<style></style>
