<template>
  <Form class="p-4 bg-white rounded shadow" @submit.prevent="submitForm">
    <Upload
      :id="getQuestionFormId"
      class="bg-gray-50 rounded cursor-pointer hover:bg-gray-200 flex mb-4 items-center justify-center"
      style="height:200px;"
      v-model="form.imageUrl"
    >
      <i class="fas fa-image fa-3x text-gray-300"></i>
    </Upload>
    <div class="mb-4">
      <InputText
        v-model="form.question"
        label="Question à poser"
        placeholder="Ex : Dans quelle ville trouve-t-on les chutes du Niagara"
      />
    </div>
    <ul>
      <li class="flex items-center mb-4">
        <div class="mr-4 font-bold">A.</div>
        <div class="flex-1">
          <InputText v-model="form.answerA.text" placeholder="Réponse A" />
        </div>
        <label class="ml-4 block">
          <Tooltip label="Cette réponse est correcte">
            <input
              type="checkbox"
              v-model="form.answerA.isCorrectAnswer"
              :value="true"
              class="form-checkbox h-5 w-5 text-green-600"
            />
          </Tooltip>
        </label>
      </li>
      <li class="flex items-center mb-4">
        <div class="mr-4 font-bold">B.</div>
        <div class="flex-1">
          <InputText v-model="form.answerB.text" placeholder="Réponse B" />
        </div>
        <label class="ml-4 block">
          <Tooltip label="Cette réponse est correcte">
            <input
              type="checkbox"
              v-model="form.answerB.isCorrectAnswer"
              :value="true"
              class="form-checkbox h-5 w-5 text-green-600"
            />
          </Tooltip>
        </label>
      </li>
      <li class="flex items-center mb-4">
        <div class="mr-4 font-bold">C.</div>
        <div class="flex-1">
          <InputText v-model="form.answerC.text" placeholder="Réponse C" />
        </div>
        <label class="ml-4 block">
          <Tooltip label="Cette réponse est correcte">
            <input
              type="checkbox"
              v-model="form.answerC.isCorrectAnswer"
              :value="true"
              class="form-checkbox h-5 w-5 text-green-600"
            />
          </Tooltip>
        </label>
      </li>
      <li class="flex items-center mb-4">
        <div class="mr-4 font-bold">D.</div>
        <div class="flex-1">
          <InputText v-model="form.answerD.text" placeholder="Réponse D" />
        </div>
        <label class="ml-4 block">
          <Tooltip label="Cette réponse est correcte">
            <input
              type="checkbox"
              v-model="form.answerD.isCorrectAnswer"
              :value="true"
              class="form-checkbox h-5 w-5 text-green-600"
            />
          </Tooltip>
        </label>
      </li>
    </ul>
    <div class="flex flex-col md:flex-row w-full">
      <ConfirmButton variant="error" :loading="state.deleteLoading" @confirm="deleteQuestion">
        <i class="fas fa-trash"></i>
      </ConfirmButton>
      <Button :motion="false" class="mt-2 md:mt-0 md:ml-2 flex-1" :loading="state.loading">Enregister</Button>
    </div>
  </Form>
</template>

<script>
import _ from 'lodash-es';

import Form from '@/components/ui/form/Form.vue';
import Button from '@/components/ui/form/Button.vue';
import ConfirmButton from '@/components/ui/ConfirmButton.vue';
import InputText from '@/components/ui/form/InputText.vue';
import Upload from '@/modules/uploads/components/Upload.vue';
import Tooltip from '@/components/ui/Tooltip.vue';

import { computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useNotify } from '@/plugins/notify';

export default {
  components: {
    Form,
    InputText,
    Tooltip,
    Button,
    ConfirmButton,
    Upload,
  },
  props: {
    question: Object,
  },
  setup(props) {
    const store = useStore();
    const notify = useNotify();

    const form = reactive({
      imageUrl: _.get(props.question, 'attachment.url'),
      question: _.get(props.question, 'question'),
      answerA: _.get(props.question, 'answers.choices.choices.0', {}),
      answerB: _.get(props.question, 'answers.choices.choices.1', {}),
      answerC: _.get(props.question, 'answers.choices.choices.2', {}),
      answerD: _.get(props.question, 'answers.choices.choices.3', {}),
    });

    const state = reactive({
      loading: false,
      deleteLoading: false,
    });

    async function submitForm() {
      state.loading = true;
      try {
        const question = {
          // eslint-disable-next-line no-underscore-dangle
          _id: props.question._id,
          format: 'choices',
          question: form.question,
          attachment: {
            type: 'image',
            url: form.imageUrl,
          },
          answers: {
            choices: {
              choices: [form.answerA, form.answerB, form.answerC, form.answerD],
            },
          },
        };
        await store.dispatch('quizzes/updateQuestion', { question });
        notify.success('Question mise à jour !');
      } catch (error) {
        console.error(error);
        notify.error(error.message);
      }
      state.loading = false;
    }

    async function deleteQuestion() {
      state.deleteLoading = true;
      try {
        // eslint-disable-next-line no-underscore-dangle
        await store.dispatch('quizzes/deleteQuestion', { questionId: props.question._id });
        notify.success('Question supprimée !');
      } catch (error) {
        console.error(error);
        notify.error(error.message);
      }
      state.deleteLoading = false;
    }

    return {
      form,
      state,
      submitForm,
      deleteQuestion,
      // eslint-disable-next-line no-underscore-dangle
      getQuestionFormId: computed(() => `question-media-${props.question._id}`),
    };
  },
};
</script>

<style></style>
