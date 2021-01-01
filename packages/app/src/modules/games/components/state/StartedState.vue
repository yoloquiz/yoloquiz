<template>
  <div class="w-full container mx-auto flex flex-1 flex-col">
    <div v-if="isScoreBoardActive()">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-900 text-xl text-white">
            <th class="py-3">Joueur</th>
            <th class="py-3">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="playerScore in getPlayersScore()" :key="playerScore.userId">
            <td class="py-2">{{ playerScore.pseudo }}</td>
            <td class="py-2">{{ playerScore.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-col items-center" v-else-if="activeQuestion">
      <img :src="activeQuestion.attachment?.url" class="shadow m-auto" style="max-height: 40vh;" />
      <h2 class="text-2xl py-4">{{ activeQuestion.question }}</h2>
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 mb-2 w-full px-4 pb-4">
        <button
          v-for="(choice, index) of getChoices()"
          class="text-white font-bold rounded outline-none focus:outline-none shadow p-4 md:p-8 bg-gray-400"
          :class="getChoiceClasses(choice, index)"
          :key="choice._id"
          :disabled="correctChoices"
          @click="sendChoice(choice._id)"
        >
          {{ choice.text }}
        </button>
      </div>
    </div>
    <div v-else class="py-8 px-4 text-center flex flex-col flex-1 justify-center items-center">
      <img src="@/assets/img/quiz.svg" alt="Quiz" class="mb-4 max-h-48 w-2/3" />
      <h2 class="text-2xl font-bold">Partie en cours</h2>
      Vous êtes connecté sur une partie en cours. Veuillez patienter pour la prochaine question.
    </div>
  </div>
</template>

<script>
import _ from 'lodash-es';
import { computed, reactive, toRefs } from 'vue';
import { mapActions, mapGetters, useStore } from 'vuex';

const CHOICES_COLOR = ['bg-red-600', 'bg-yellow-600', 'bg-green-600', 'bg-blue-600'];

export default {
  setup() {
    const store = useStore();

    const state = reactive({
      activeQuestion: computed(() => store.state.games.activeQuestion),
      correctChoices: computed(() => store.state.games.correctChoices),
      playerChoiceId: computed(() => store.state.games.playerChoiceId),
    });

    function getChoiceBackgroundColor(choice, index) {
      const { _id: choiceId } = choice;

      if (state.correctChoices) {
        const isCorrectAnswer = _.includes(state.correctChoices, choiceId);
        return isCorrectAnswer ? 'bg-green-400' : 'bg-red-400';
      }

      return CHOICES_COLOR[index];
    }

    function getChoiceClasses(choice, index) {
      const { _id: choiceId } = choice;
      const color = getChoiceBackgroundColor(choice, index);

      return {
        'disabled:opacity-60 hover:opacity-80': state.playerChoiceId && !state.correctChoices,
        'border-4 border-primary': state.playerChoiceId === choiceId,
        [color]: true,
      };
    }

    return {
      getChoiceClasses,
      ...toRefs(state),
      ...mapActions('games', ['sendGameProceed', 'sendChoice']),
      ...mapGetters('games', ['getChoices', 'getPlayersScore', 'isScoreBoardActive']),
    };
  },
};
</script>

<style></style>
