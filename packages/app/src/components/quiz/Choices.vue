<template>
  <div class="grid gap-2">
    <div
      v-for="(choice, index) of choices"
      :key="choice.key"
      class="cursor-pointer border-2 border-transparent py-3 px-4 my-1 rounded-lg items-center flex hover:bg-green-100"
      :class="{
        'border-green-300': isAnswerSelected({ answerKey: choice.key }),
      }"
      @click.stop="selectAnswer({ answerKey: choice.key })"
    >
      <span class="font-bold pr-2">{{ getLetterFromIndex({ index }) }}.</span>
      <span class="flex-1 text-left">{{ choice.value }}</span>
      <input
        @click.stop="selectAnswer({ answerKey: choice.key })"
        :checked="isAnswerSelected({ answerKey: choice.key })"
        class="justify-self-end cursor-pointer"
        type="checkbox"
      />
    </div>
  </div>
</template>

<script>
import { findIndex } from 'lodash-es';

export default {
  props: {
    question: { type: Object, required: true },
  },
  data: () => ({
    selectedAnswers: [],
  }),
  computed: {
    choices() {
      return this.question.choices;
    },
  },
  watch: {
    selectedAnswers: {
      handler(answers) {
        this.$emit('answer', { answer: answers });
      },
      deep: true,
    },
  },
  methods: {
    getLetterFromIndex({ index }) {
      return String.fromCharCode(65 + index);
    },
    selectAnswer({ answerKey }) {
      const selectedAnswerIndex = findIndex(this.selectedAnswers, { key: answerKey });

      if (selectedAnswerIndex < 0) {
        this.selectedAnswers.push({ key: answerKey });
      } else {
        this.selectedAnswers.splice(selectedAnswerIndex, 1);
      }
    },
    isAnswerSelected({ answerKey }) {
      return findIndex(this.selectedAnswers, { key: answerKey }) > -1;
    },
  },
};
</script>

<style></style>
