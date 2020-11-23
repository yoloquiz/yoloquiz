<template>
  <button
    class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
    style="transition: all 0.15s ease 0s;"
    :class="classes"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div class="animate-spin w-6 text-black absolute inset-x-0 mx-auto">
      <svg v-show="loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div :class="{ invisible: loading }">
      <slot />
    </div>
  </button>
</template>

<script>
export default {
  props: {
    modelValue: { type: String },
    label: { type: String },
    placeholder: { type: String },
    type: { type: String, default: 'text' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    classes() {
      return {
        'hover:ring-1': !this.loading && !this.disabled,
        'hover:ring-blue-500': !this.loading && !this.disabled,
        'disabled:opacity-60': this.disabled,
        'cursor-not-allowed': this.disabled && !this.loading,
        'cursor-wait': this.loading,
      };
    },
  },
};
</script>
