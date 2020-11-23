<template>
  <label>
    <span class="block uppercase text-gray-700 text-xs font-bold mb-2">{{ label }}</span>
    <input
      ref="input"
      style="transition: all 0.15s ease 0s;"
      class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
      :type="type"
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
