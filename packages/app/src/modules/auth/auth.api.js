import { publicApi } from '@/modules/shared/api/api.public';

// eslint-disable-next-line import/prefer-default-export
export async function login({ email, password }) {
  const { data } = await publicApi({
    method: 'POST',
    url: 'login',
    data: {
      email,
      password,
    },
  });

  return data;
}
