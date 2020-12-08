import { privateApi } from '@/modules/shared/api/api.private';

// eslint-disable-next-line import/prefer-default-export
export async function uploadFile({ formData }) {
  const { data } = await privateApi({
    method: 'POST',
    url: '/uploads',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}
