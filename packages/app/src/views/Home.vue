<template>
  <Layout container>
    <div class="text-xl font-bold mb-4">
      Rejoignez une session
      <i class="far fa-hand-point-down"></i>
    </div>
    <div class="shadow rounded overflow-hidden inline-block pl-4 pr-3 py-3">
      <input
        type="text"
        placeholder="Entrez le code"
        v-model="gameCode"
        @paste.prevent
        @keypress.prevent="gameCodePress"
        class="outline-none text-xl focus:outline-none"
      />
      <button
        class="outline-none focus:outline-none"
        :disabled="!isGameCodeValid"
        :class="{
          'opacity-20 cursor-not-allowed text-gray-900': !isGameCodeValid,
          'text-green-400': isGameCodeValid,
        }"
        @click="openGameRoom"
      >
        <i class="fas fa-play"></i>
      </button>
    </div>
    <div v-if="quizzes" class="text-left py-4 flex flex-col w-full md:w-2/3 mx-auto">
      <div
        v-for="quiz in quizzes"
        :key="quiz._id"
        :to="`/quizzes/${quiz._id}`"
        class="flex items-center shadow bg-white w-full text-gray-900 py-2 px-4 mb-4 rounded"
      >
        <div
          class="rounded-full flex items-center justify-center text-2xl text-gray-400 bg-gray-100 mr-4"
          style="width: 64px;height: 64px;"
        >
          {{ avatarLetter(quiz) }}
        </div>
        <div class="flex-1 text-sm">
          <div class="font-bold text-xl">{{ quiz.name }}</div>
          <div class="flex">
            <div class="mr-2"><i class="far fa-question-circle"></i> {{ quiz.questions.length }} questions</div>
            <div><i class="far fa-chart-bar"></i> {{ quiz.countPlayed }} sessions</div>
          </div>
        </div>
        <div>
          <router-link :to="`/quizzes/${quiz._id}`" class="p-2 mr-2 text-primary hover:text-gray-700">
            <i class="fas fa-edit"></i>
          </router-link>
          <router-link :to="`/quizzes/${quiz._id}/play`" class="p-2 text-green-400 hover:text-green-600">
            <i class="fas fa-play"></i>
          </router-link>
        </div>
      </div>
      <img src="@/assets/img/empty.svg" class="w-5/6 mx-auto mt-12 mb-24" alt="empty-events" v-show="isEmpty" />
      <Button @click="$router.push('/quizzes/create')" class="mb-24">
        Créer un quiz
      </Button>
    </div>
  </Layout>
</template>

<script>
import _ from 'lodash-es';
import { useStore } from 'vuex';
import Layout from '@/components/layouts/Layout.vue';
import Button from '@/components/ui/Button.vue';
import { computed, onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Home',
  components: {
    Button,
    Layout,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const state = reactive({
      quizzes: computed(() => store.state.quizzes.list),
      isEmpty: computed(() => _.isEmpty(store.state.quizzes.list)),
      gameCode: '',
    });

    const isGameCodeValid = computed(() => {
      return /^[A-Z0-9]{6}$/.test(state.gameCode);
    });

    function openGameRoom() {
      if (!isGameCodeValid.value) return;
      router.push(`/${state.gameCode}`);
    }

    function gameCodePress(event) {
      if (event.code === 'Enter') {
        openGameRoom();
        return;
      }
      if (_.size(state.gameCode) >= 6) return;
      if (!/^[A-Z0-9]$/i.test(event.key)) return;

      state.gameCode += _.toUpper(event.key);
    }

    function avatarLetter({ name }) {
      return (name || 'A').slice(0, 1).toUpperCase();
    }

    onMounted(() => {
      store.dispatch('quizzes/fetchAll');
    });

    return {
      gameCodePress,
      avatarLetter,
      isGameCodeValid,
      openGameRoom,
      ...toRefs(state),
    };
  },
};
</script>
