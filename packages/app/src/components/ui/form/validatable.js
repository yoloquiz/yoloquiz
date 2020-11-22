import { differenceWith, first, isEqual } from 'lodash-es';
import { computed, inject, nextTick, onBeforeMount, onBeforeUnmount, reactive, watch } from 'vue';

export default function useValidatable({ props, emit }) {
  const { register, unregister } = inject('form');

  const state = reactive({
    errorBucket: [],
    hasError: computed(() => state.errorBucket.length > 0),
    lazyValue: props.modelValue,
    internalValue: computed({
      get() {
        return state.lazyValue;
      },
      set(value) {
        state.lazyValue = value;
        emit('update:modelValue', value);
      },
    }),
    isResetting: false,
    hasInput: false,
    isFocused: false,
    hasFocused: false,
    valid: false,
    shouldValidate: computed(() => {
      if (state.isResetting) return false;

      return props.validateOnBlur ? state.hasFocused && !state.isFocused : state.hasInput || state.hasFocused;
    }),
    validationTarget: computed(() => {
      if (state.shouldValidate) return state.errorBucket;
      return [];
    }),
    hasErrorMessages: computed(() => state.validationTarget.length > 0),
    errorMessages: computed(() => state.validationTarget),
    firstErrorMessage: computed(() => first(state.errorMessages)),
  });

  watch(
    () => props.modelValue,
    (value) => {
      state.lazyValue = value;
    },
  );

  const context = {
    state,
  };

  register(context);

  onBeforeUnmount(() => {
    unregister(context);
  });

  function validate() {
    if (!props.rules) return undefined;

    const errorBucket = [];
    const value = state.internalValue;

    // eslint-disable-next-line no-restricted-syntax
    for (const rule of props.rules) {
      const result = typeof rule === 'function' ? rule(value) : rule;

      if (typeof result === 'string') {
        errorBucket.push(result);
      } else if (typeof result !== 'boolean') {
        console.error(`Rules should return a string or boolean, received '${typeof result}' instead`);
      }
    }

    state.errorBucket = errorBucket;
    state.valid = errorBucket.length === 0;

    return state.valid;
  }

  watch(
    () => props.rules,
    (value, oldValue) => {
      if (differenceWith(value, oldValue, isEqual)) return;
      validate();
    },
  );

  watch(
    () => state.internalValue,
    () => {
      state.hasInput = true;

      // eslint-disable-next-line no-unused-expressions
      props.validateOnBlur || nextTick(validate);
    },
  );

  onBeforeMount(() => {
    validate();
  });

  return context;
}
