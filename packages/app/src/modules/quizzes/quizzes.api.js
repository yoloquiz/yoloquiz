import { privateApi } from '@/modules/shared/api/api.private';

export async function fetchAll() {
  const { data } = await privateApi({
    method: 'GET',
    url: '/quizzes',
  });
  return { quizzes: data };
}

export async function createQuiz({ name }) {
  const { data } = await privateApi({
    method: 'POST',
    url: '/quizzes',
    data: {
      name,
    },
  });
  return { quiz: data };
}

export function deleteQuiz({ quizId }) {
  return privateApi({
    method: 'DELETE',
    url: `/quizzes/${quizId}`,
  });
}

export async function fetchOneQuiz({ quizId }) {
  const { data } = await privateApi({
    method: 'GET',
    url: `/quizzes/${quizId}`,
  });
  return { quiz: data };
}

export async function createQuestion({ quizId }) {
  const { data } = await privateApi({
    method: 'POST',
    url: `/quizzes/${quizId}/questions`,
  });
  return { question: data };
}

export async function updateQuestion({ quizId, question }) {
  await privateApi({
    method: 'PUT',
    url: `/quizzes/${quizId}/questions`,
    data: question,
  });
}

export async function deleteQuestion({ quizId, questionId }) {
  await privateApi({
    method: 'DELETE',
    url: `/quizzes/${quizId}/questions`,
    data: { questionId },
  });
}

export async function createQuizRoom({ quizId }) {
  const { data } = await privateApi({
    method: 'POST',
    url: `/games/`,
    data: { quizId },
  });
  return data;
}
