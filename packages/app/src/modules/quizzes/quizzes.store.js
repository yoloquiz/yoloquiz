import _ from 'lodash-es';
import * as quizzesApi from '@/modules/quizzes/quizzes.api';

const stateData = {
  list: undefined,
  current: undefined,
};

const getters = {};

const mutations = {
  setList(state, { quizzes }) {
    state.list = quizzes;
  },
  setCurrent(state, { quiz }) {
    state.current = quiz;
  },
  addQuiz(state, { quiz }) {
    if (!state.list) return;
    state.list.push(quiz);
  },
  addQuestion(state, { question }) {
    if (!state.current) return;
    state.current.questions.push(question);
  },
  updateQuestion(state, { question }) {
    if (!state.current) return;
    const { _id: questionId } = question;
    const questionIndex = _.findIndex(state.current.questions, { _id: questionId });
    if (questionIndex < 0) return;
    state.current.questions[questionIndex] = question;
  },
  deleteQuestion(state, { questionId }) {
    if (!state.current) return;
    _.remove(state.current.questions, { _id: questionId });
  },
};

const actions = {
  async fetchAll({ commit }) {
    try {
      const { quizzes } = await quizzesApi.fetchAll();
      commit('setList', { quizzes });
      return quizzes;
    } catch (error) {
      console.error(error);
      throw new Error('Impossible de récupérer la liste des quizs');
    }
  },
  async createQuiz({ commit }, { name }) {
    try {
      const { quiz } = await quizzesApi.createQuiz({ name });
      commit('setCurrent', { quiz });
      commit('addQuiz', { quiz });
      return quiz;
    } catch (error) {
      console.error(error);
      throw new Error('Impossible de créer le quiz');
    }
  },
  async fetchOneQuiz({ commit }, { quizId }) {
    try {
      const { quiz } = await quizzesApi.fetchOneQuiz({ quizId });
      commit('setCurrent', { quiz });
    } catch (error) {
      console.error(error);
      throw new Error('404 Quiz not found.');
    }
  },
  async createQuestion({ commit, state }) {
    try {
      const { _id: quizId } = state.current;
      const { question } = await quizzesApi.createQuestion({ quizId });
      commit('addQuestion', { question });
    } catch (error) {
      console.error(error);
      throw new Error('Impossible de créer une nouvelle question');
    }
  },
  async updateQuestion({ commit, state }, { question }) {
    try {
      const { _id: quizId } = state.current;
      await quizzesApi.updateQuestion({ quizId, question });
      commit('updateQuestion', { question });
    } catch (error) {
      console.error(error);
      throw new Error('Impossible de sauvegarder la question');
    }
  },
  async deleteQuestion({ commit, state }, { questionId }) {
    try {
      const { _id: quizId } = state.current;
      await quizzesApi.deleteQuestion({ quizId, questionId });
      commit('deleteQuestion', { questionId });
    } catch (error) {
      console.error(error);
      throw new Error('Impossible de supprimer la question');
    }
  },
};

export default {
  namespaced: true,
  state: { ...stateData },
  getters,
  mutations,
  actions,
};
