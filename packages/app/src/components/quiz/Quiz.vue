<template>
  <div>
    <h1 class="text-2xl font-extrabold">
      {{ quiz.name }}
    </h1>
    <div class="font-light">Question 1/3</div>
  </div>
</template>

<script>
export default {
  props: {
    quiz: { type: Object, required: true },
  },
};
</script>

<style></style>
