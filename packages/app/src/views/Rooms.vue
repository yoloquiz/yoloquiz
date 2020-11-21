<template>
  <div class="container mx-auto h-full py-16">
    <div class="grid md:grid-cols-6 h-full">
      <div class="col-span-4">
        <Quiz :quiz="quiz" />
        <Question :question="question" />
      </div>
    </div>
  </div>
</template>

<script>
import Quiz from '@/components/quiz/Quiz.vue';
import Question from '@/components/quiz/Question.vue';

export default {
  components: { Question, Quiz },
  data: () => ({
    quiz: {
      name: 'Lorem ipsum',
    },
    question: {
      question: `Quelle est la couleur du cheval blanc d'Henry IV ?`,
      type: 'choices',
      choices: [
        {
          key: 'rouge',
          value: 'Rouge',
        },
        {
          key: 'green',
          value: 'Vert',
        },
        {
          key: 'white',
          value: 'Blanc',
        },
      ],
    },
  }),
};
</script>

<style></style>
