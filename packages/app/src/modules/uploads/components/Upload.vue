<template>
  <label :for="id" :style="styles" class="bg-cover">
    <input type="file" class="hidden" :id="id" @change="uploadFile" accept="image/png, image/jpeg" />
    <slot v-if="!state.previewUrl && !modelValue" />
  </label>
</template>

<script>
import { computed, reactive } from 'vue';
import * as uploadsApi from '../uploads.api';

export default {
  props: {
    id: String,
    modelValue: String,
  },
  setup(props, { emit }) {
    const state = reactive({
      previewUrl: undefined,
    });

    async function uploadFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      state.previewUrl = window.URL.createObjectURL(file);
      try {
        const { url } = await uploadsApi.uploadFile({ formData });
        emit('upload', url);
        emit('update:modelValue', url);
      } catch (error) {
        console.error(error);
      }
    }

    const styles = computed(() => {
      if (!props.modelValue && !state.previewUrl) return {};
      return {
        backgroundImage: `url(${props.modelValue || state.previewUrl})`,
      };
    });

    return {
      uploadFile,
      styles,
      state,
    };
  },
};
</script>

<style></style>
