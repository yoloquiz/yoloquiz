<template>
  <div class="border-2 p-8">
    <h2 class="text-lg font-bold">
      {{ question.question }}
    </h2>
    <component class="py-6 px-12" :is="question.type" :question="question" @answer="onAnswer" />
  </div>
</template>

<script>
import Choices from './Choices.vue';

export default {
  components: {
    Choices,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onAnswer({ answer }) {
      this.$emit('answer', { answer });
    },
  },
};
</script>

<style></style>
