<template>
  <div class="rounded-md shadow border">
    <div class="p-6">
      <div v-if="title" class="pb-5 text-2xl font-bold text-left">{{ title }}</div>
      <div class="">
        <slot />
      </div>
      <div class="pt-3 flex justify-end">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String },
  },
};
</script>

<style></style>
