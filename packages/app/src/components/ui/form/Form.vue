<template>
  <form :novalidate="true" v-bind="$attrs">
    <slot />
  </form>
</template>

<script>
import { provide, reactive, watch } from 'vue';
import { has } from 'lodash-es';
/* eslint-disable no-underscore-dangle */

export default {
  inheritAttrs: false,
  props: {
    lazyValidation: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const state = reactive({
      inputs: [],
      watchers: [],
      errorBag: {},
    });

    watch(
      () => state.errorBag,
      (values) => {
        const isFormInvalid = Object.values(values).includes(true);
        emit('update:modelValue', !isFormInvalid);
      },
    );

    function watchInput(input) {
      const watcher = (inputState) =>
        watch(
          () => inputState.hasError,
          (value) => {
            state.errorBag[inputState._uid] = value; // ?
            // TODO Immediate watcher ?
          },
        );

      const watchers = {
        _uid: input._uid,
        valid: () => {},
        shouldValidate: () => {},
      };

      if (props.lazyValidation) {
        // Only start watching inputs if we need to

        watchers.shouldValidate = watch(
          () => input.state.shouldValidate,
          (value) => {
            if (!value) return;
            if (has(state.errorBag, input.state._uid)) return;

            watchers.valid = watcher(input.state);
          },
        );
      } else {
        watchers.valid = watcher(input.state);
      }

      return watchers;
    }

    function validate() {
      return state.inputs.filter((input) => !input.validate(true)).length === 0;
    }

    function resetErrorBag() {
      if (!props.lazyValidation) return;
      // Account for timeout in validatable
      setTimeout(() => {
        state.errorBag = {};
      }, 0);
    }

    function reset() {
      state.inputs.forEach((input) => input.reset());
      resetErrorBag();
    }

    function register(input) {
      state.inputs.push(input);
      state.watchers.push(watchInput(input));
    }

    function unregister(input) {
      const found = state.inputs.find((i) => i._uid === input._uid);
      if (!found) return;

      const unwatch = state.watchers.find((i) => i._uid === found._uid);
      if (unwatch) {
        unwatch.valid();
        unwatch.shouldValidate();
      }

      state.watchers = state.watchers.filter((i) => i._uid !== found._uid);
      state.inputs = state.inputs.filter((i) => i._uid !== found._uid);

      delete state.errorBag[found._uid];
    }

    provide('form', {
      register,
      unregister,
    });

    return {
      validate,
      reset,
    };
  },
};
</script>
