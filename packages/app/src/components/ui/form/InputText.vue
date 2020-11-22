<template>
  <label class="w-full pt-1 pb-5 flex flex-col">
    <span class="font-medium text-left py-1">{{ label }}</span>
    <input
      ref="input"
      :type="type"
      class="py-3 px-4 transition duration-300 border hover:ring-1 hover:ring-blue-500 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
      :class="inputClasses"
      :placeholder="placeholder"
      v-model="state.internalValue"
    />
    <span
      class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1 text-xs h-4"
      :class="{ invisible: !state.hasErrorMessages }"
    >
      {{ state.firstErrorMessage }}
    </span>
  </label>
</template>

<script>
import { computed, onMounted, ref } from 'vue';

import useValidatable from './validatable';

export default {
  props: {
    modelValue: { type: String },
    label: { type: String },
    placeholder: { type: String },
    type: { type: String, default: 'text' },
    autofocus: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] },
  },
  setup(props, { emit }) {
    const input = ref(null);

    const { state } = useValidatable({ props, emit });

    function tryAutofocus() {
      if (typeof document === 'undefined' || !input.value || document.activeElement === input.value) return false;

      input.value.focus();

      return true;
    }

    onMounted(() => {
      if (props.autofocus) {
        tryAutofocus();
      }
    });

    const inputClasses = computed(() => ({
      'ring-1': state.hasErrorMessages,
      'ring-red-500': state.hasErrorMessages,
    }));

    return { input, state, inputClasses };
  },
};
</script>
