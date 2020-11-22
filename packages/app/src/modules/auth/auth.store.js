import { login } from './auth.api';

const stateData = {
  accessToken: undefined,
  user: undefined,
};

const getters = {
  isAuthenticated: ({ accessToken, user }) => !!accessToken && !!user,
  accessToken: ({ accessToken }) => accessToken,
};

const mutations = {
  setUser(state, { user }) {
    state.user = user;
  },
  setAccessToken(state, { accessToken }) {
    state.accessToken = accessToken;
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      const { accessToken, user } = await login({ email, password });

      commit('setUser', { user });
      commit('setAccessToken', { accessToken });
    } catch (error) {
      throw new Error(`Une erreur est survenue lors de l'authentification!`);
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
