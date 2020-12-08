import { publicApi } from '@/modules/shared/api/api.public';
import { privateApi } from '@/modules/shared/api/api.private';

export async function login({ email, password }) {
  const { data } = await publicApi({
    method: 'POST',
    url: '/auth/login',
    data: {
      email,
      password,
    },
  });

  return data;
}

export async function register({ email, password, firstName, lastName }) {
  const { data } = await publicApi({
    method: 'POST',
    url: '/auth/register',
    data: {
      email,
      password,
      firstName,
      lastName,
    },
  });

  return data;
}

export async function fetchUser() {
  const { data: user } = await privateApi({
    method: 'GET',
    url: '/users/me',
  });

  return { user };
}

export async function resetPassword({ password }) {
  await privateApi({
    method: 'POST',
    url: '/auth/reset-password',
    data: { password },
  });
}

export async function updateProfile({ firstName, lastName }) {
  await privateApi({
    method: 'PATCH',
    url: '/users/me',
    data: { firstName, lastName },
  });
}

export async function passwordRecovery({ email }) {
  await publicApi({
    method: 'POST',
    url: '/auth/recovery',
    data: {
      email,
    },
  });
}
