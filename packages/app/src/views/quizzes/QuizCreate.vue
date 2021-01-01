<template>
  <Layout container>
    <div class="text-center mx-auto mt-12 md:w-2/3">
      <h1 class="text-3xl mb-8">Donnez un nom à votre quiz</h1>
      <p class="mb-8">Cette étape permet aux joueurs de facilement identifier la thématique du quiz.</p>
      <Form id="quiz-create-form" @submit.prevent="submitForm">
        <InputText
          v-model="form.name"
          :rules="rules"
          label="Nom du quiz"
          placeholder="Saisissez par exemple une thématique"
        />
        <Button :loading="state.loading" form="quiz-create-form" :disabled="!isFormValid">Créer</Button>
      </Form>
    </div>
  </Layout>
</template>

<script>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import Form from '@/components/ui/form/Form.vue';
import InputText from '@/components/ui/form/InputText.vue';
import Button from '@/components/ui/form/Button.vue';
import { getIsRequiredRule } from '@/modules/shared/utils/formValidationRules';
import Layout from '@/components/layouts/Layout.vue';
import { useNotify } from '@/plugins/notify';

export default {
  components: {
    Form,
    Button,
    InputText,
    Layout,
  },
  setup() {
    const notify = useNotify();
    const store = useStore();
    const router = useRouter();

    const state = reactive({
      loading: false,
    });

    const form = reactive({
      name: undefined,
    });

    async function submitForm() {
      state.loading = true;
      try {
        const { _id: quizId } = await store.dispatch('quizzes/createQuiz', form);
        notify.success('Le Quiz a été créé !');
        router.push({
          name: 'Quiz',
          params: { quizId },
        });
      } catch (error) {
        notify.error(error.message);
      }
      state.loading = false;
    }

    return {
      rules: [getIsRequiredRule()],
      submitForm,
      form,
      state,
      isFormValid: computed(() => {
        return form.name && form.name.length > 0 && !state.loading;
      }),
    };
  },
};
</script>

<style></style>
