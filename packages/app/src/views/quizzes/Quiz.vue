<template>
  <Layout container>
    <div v-if="quiz">
      <h1 class="text-3xl mt-8 mb-6">{{ quiz.name }}</h1>
      <QuizEditor />
      <ConfirmButton variant="error" class="ml-4" @confirm="deleteQuiz">
        Supprimer le quiz
      </ConfirmButton>
    </div>
    <div v-else>
      Chargement...
    </div>
  </Layout>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

import QuizEditor from '@/modules/quizzes/components/QuizEditor.vue';
import Layout from '@/components/layouts/Layout.vue';
import ConfirmButton from '@/components/ui/ConfirmButton.vue';
import { useNotify } from '@/plugins/notify';

export default {
  components: {
    QuizEditor,
    Layout,
    ConfirmButton,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const notify = useNotify();

    const quiz = computed(() => store.state.quizzes.current);

    onMounted(async () => {
      try {
        await store.dispatch('quizzes/fetchOneQuiz', route.params);
      } catch (error) {
        notify.error(error.message);
      }
    });

    function deleteQuiz() {
      store.dispatch('quizzes/deleteQuiz');
      notify('Le quiz a été supprimé');
      router.push('/');
    }

    return {
      quiz,
      deleteQuiz,
    };
  },
};
</script>

<style></style>
