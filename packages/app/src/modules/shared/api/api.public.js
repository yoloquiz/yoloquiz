import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const publicApi = ({ method = 'GET', ...options }) => {
  return axios({
    method,
    baseURL: 'http://localhost:3000',
    ...options,
  });
};
