<template>
  <div class="w-4/5 md:w-1/2 mx-auto text-center flex flex-col items-center justify-items-center">
    <h1 class="text-4xl my-8">YoloQuiz</h1>
    <p class="text-xl mb-6">
      Commencez dès maintenant à créer vos quizzes
    </p>
    <div v-if="isLoading">
      Chargement en cours...
    </div>
    <div v-else class="flex flex-col w-full md:w-1/2">
      <router-link
        v-for="quiz in quizzes"
        :key="quiz._id"
        :to="`/quizzes/${quiz._id}`"
        class="shadow bg-white hover:bg-gray-50 w-full text-gray-900 py-2 px-4 mb-4 rounded"
      >
        <div class="font-bold text-xl">{{ quiz.name }}</div>
        <div>{{ quiz.questions.length }} questions</div>
      </router-link>
      <img src="@/assets/img/empty.svg" class="w-5/6 mx-auto mt-12 mb-24" alt="empty-events" v-show="isEmpty" />
      <Button @click="$router.push('/quizzes/create')" class="mb-24">
        Créer un quiz
      </Button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Button from '@/components/ui/Button.vue';

export default {
  name: 'Home',
  components: {
    Button,
  },
  computed: mapState({
    quizzes: ({ quizzes }) => quizzes.list || [],
    isLoading: ({ quizzes }) => !quizzes.list,
    isEmpty: ({ quizzes }) => (quizzes.list ? quizzes.list.length === 0 : true),
  }),
  async mounted() {
    try {
      await this.$store.dispatch('quizzes/fetchAll');
    } catch (error) {
      this.$notify.error(error.message);
    }
  },
};
</script>
