<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-4 gap-4">
    <QuestionForm v-for="question of quiz.questions" :key="question._id" :question="question" class="mb-4" />
  </div>
  <Button class="mb-8" @click="createQuestion">Nouvelle question</Button>
</template>

<script>
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';

import Button from '@/components/ui/form/Button.vue';
import QuestionForm from '@/modules/quizzes/components/QuestionForm.vue';
import { useNotify } from '@/plugins/notify';

export default {
  components: {
    QuestionForm,
    Button,
  },
  setup() {
    const store = useStore();
    const notify = useNotify();

    const state = reactive({
      loading: false,
    });

    const quiz = computed(() => store.state.quizzes.current);

    async function createQuestion() {
      try {
        state.loading = true;
        await store.dispatch('quizzes/createQuestion');
        notify.success('Question créée avec succès');
      } catch (error) {
        console.error(error);
        notify.error(error.message);
      }
      state.loading = false;
    }

    return {
      quiz,
      state,
      createQuestion,
    };
  },
};
</script>

<style></style>
