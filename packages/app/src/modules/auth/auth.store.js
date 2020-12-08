import _ from 'lodash-es';
import axios from 'axios';
import { login, register, fetchUser, resetPassword, updateProfile, passwordRecovery } from '@/modules/auth/auth.api';

const defaultState = { accessToken: undefined, user: {} };

function getInitialState() {
  const accessToken = localStorage.getItem('token');
  if (!accessToken) return defaultState;
  const tokenData = _(accessToken)
    .split('.')
    .nth(1);
  try {
    const user = JSON.parse(atob(tokenData));

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return { ...defaultState, accessToken, user };
  } catch (error) {
    console.error(error);
    return defaultState;
  }
}

const stateData = getInitialState();

const getters = {
  isAuthenticated: ({ accessToken, user }) => !!accessToken && !!user,
  currentUser: ({ user }) => user,
  isProfileComplete: ({ user }) => !_.isEmpty(user.firstName) && !_.isEmpty(user.lastName),
};

const mutations = {
  setUser(state, { user }) {
    state.user = user;
  },
  setProfile(state, { firstName, lastName }) {
    state.user = {
      ...state.user,
      firstName,
      lastName,
    };
  },
  setAccessToken(state, { accessToken }) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    localStorage.setItem('token', accessToken);
    state.accessToken = accessToken;
  },
  removeAccessToken(state) {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
    state.user = {};
    state.accessToken = undefined;
  },
};

const actions = {
  async login({ dispatch }, { email, password }) {
    try {
      const { token: accessToken } = await login({ email, password });
      await dispatch('storeAccessToken', { accessToken });
    } catch (error) {
      console.log(error);
      throw new Error("Une erreur est survenue lors de l'authentification!");
    }
  },
  logout({ commit }) {
    commit('removeAccessToken');
  },
  async register(props, { email, password, firstName, lastName }) {
    try {
      await register({ email, password, firstName, lastName });
    } catch (error) {
      console.log(error);
      throw new Error("Une erreur est survenue lors de l'inscription!");
    }
  },
  async recovery(props, { email }) {
    try {
      await passwordRecovery({ email });
    } catch (error) {
      console.log(error);
      throw new Error("Impossible d'envoyer un mail de réinitialisation");
    }
  },
  async resetPassword(props, { password }) {
    try {
      await resetPassword({ password });
    } catch (error) {
      console.log(error);
      throw new Error('Impossible de mettre à jour le mot de passe');
    }
  },
  async fetchUser({ commit }) {
    try {
      const { user } = await fetchUser();
      // eslint-disable-next-line no-underscore-dangle
      commit('setUser', {
        user: {
          userId: _.get(user, '_id'),
          ...user,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error('Unable to fetch user info');
    }
  },
  async updateProfile({ commit }, { firstName, lastName }) {
    try {
      await updateProfile({ firstName, lastName });
      commit('setProfile', { firstName, lastName });
    } catch (error) {
      console.log(error);
      throw new Error('Mise à jour du profile impossible!');
    }
  },
  storeAccessToken({ commit }, { accessToken }) {
    commit('setAccessToken', { accessToken });
  },
};

export default {
  namespaced: true,
  state: { ...stateData },
  getters,
  mutations,
  actions,
};
