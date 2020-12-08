<template>
  <div v-if="quiz" class="px-4">
    <h1 class="text-3xl mt-12 mb-8">{{ quiz.name }}</h1>
    <QuizEditor />
  </div>
  <div v-else>
    Chargement...
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import QuizEditor from '@/modules/quizzes/components/QuizEditor.vue';
import { useNotify } from '@/plugins/notify';

export default {
  components: { QuizEditor },
  setup() {
    const store = useStore();
    const route = useRoute();
    const notify = useNotify();

    const quiz = computed(() => store.state.quizzes.current);

    onMounted(async () => {
      try {
        await store.dispatch('quizzes/fetchOneQuiz', route.params);
      } catch (error) {
        notify.error(error.message);
      }
    });

    return {
      quiz,
    };
  },
};
</script>

<style></style>
