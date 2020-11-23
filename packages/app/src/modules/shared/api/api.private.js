import axios from 'axios';

import store from '@/store';

// eslint-disable-next-line import/prefer-default-export
export const privateApi = async ({ method = 'GET', headers = {}, ...options }) => {
  const { accessToken } = await store.getters['auth/accessToken'];
  if (!accessToken) throw new Error('Unauthorized!');

  return axios({
    method,
    baseURL: 'http://localhost:3000',
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
    ...options,
  });
};
