import * as quizzesService from './quizzes.service.js';
import * as quizzesSchema from './quizzes.schema.js';

export function findAllQuizzes() {
  return {
    method: 'GET',
    url: '/',
    handler: () => {
      return quizzesService.findAllQuizzes();
    },
  };
}

export function createOneQuiz() {
  return {
    method: 'POST',
    url: '/',
    schema: quizzesSchema.createOneQuizSchema,
    handler: (request) => {
      const { user } = request;
      const { quiz } = request.body;

      return quizzesService.createOneQuiz({ quiz, user });
    },
  };
}

export default async (app) => {
  app.route(findAllQuizzes(app));
  app.route(createOneQuiz(app));
}
