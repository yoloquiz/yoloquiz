<template>
  <div class="py-8 container mx-auto text-center flex h-full flex-col flex-1 justify-center items-center">
    <img src="@/assets/img/quiz.svg" alt="Quiz" class="mb-4 max-h-48 w-2/3" />
    <h2 class="text-2xl font-bold">{{ quiz()?.name }}</h2>
    <h3>En attente de lancement...</h3>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  setup() {
    return mapState('games', ['quiz']);
  },
};
</script>

<style></style>
