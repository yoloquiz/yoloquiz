<template>
  <button
    class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
    :class="{
      'w-full': fullWidth,
      'opacity-60 cursor-not-allowed': disabled,
    }"
    style="transition: all 0.15s ease 0s;"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
