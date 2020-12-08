import axios from 'axios';
import config from '@/config';

// eslint-disable-next-line import/prefer-default-export
export const publicApi = ({ method = 'GET', ...options }) => {
  return axios({
    method,
    baseURL: config.apiUrl,
    ...options,
  });
};
