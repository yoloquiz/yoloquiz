import axios from 'axios';
import config from '@/config';

// eslint-disable-next-line import/prefer-default-export
export const privateApi = async ({ method = 'GET', url, ...options }) => {
  if (!axios.defaults.headers.common.Authorization) throw new Error('Unauthorized!');

  return axios({
    method,
    baseURL: config.apiUrl,
    url,
    ...options,
  });
};
