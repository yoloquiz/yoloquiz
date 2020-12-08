import _ from 'lodash';
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
    handler: async (request) => {
      const { userId } = request.account;
      const { name } = request.body;

      return await quizzesService.createOneQuiz({ userId, name });
    },
  };
}

export function fetchOneQuiz() {
  return {
    method: 'GET',
    url: '/:quizId',
    handler: async (request) => {
      const { quizId } = request.params;
      return await quizzesService.findOneQuizById({ quizId });
    }
  }
}

export function createQuestion() {
  return {
    method: 'POST',
    url: '/:quizId/questions',
    handler: async (request, reply) => {
      const { quizId } = request.params;
      const { userId } = request.account;
      
      try {
        const quiz = await quizzesService.findQuizOfUserOrFail({ quizId, userId });
        
        quiz.questions.push({
          question: undefined,
          attachment: {
            type: 'image',
            url: undefined,
          },
          answers: {
            choices: {
              choices: [],
            }
          },
          format: 'choices',
        });

        await quiz.save();

        return _.last(quiz.questions);
      } catch (error) {
        reply.unauthorized(error.message);
      }
    }
  }
}

export function updateQuestion() {
  return {
    method: 'PUT',
    url: '/:quizId/questions',
    schema: quizzesSchema.updateQuestionSchema,
    handler: async (request, reply) => {
      const { quizId } = request.params;
      const { userId } = request.account;
      const { _id: questionId, question, attachment, answers, format } = request.body;
      
      try {
        const quiz = await quizzesService.findQuizOfUserOrFail({ quizId, userId });
        
        const questionIndex = _.findIndex(quiz.questions, ({ _id }) => _id.toString() === questionId);

        if (questionIndex < 0) {
          reply.notFound('Question not found');
          return;
        }

        quiz.questions[questionIndex].question = question;
        quiz.questions[questionIndex].attachment = attachment;
        quiz.questions[questionIndex].answers = answers;
        quiz.questions[questionIndex].format = format;

        await quiz.save();

        reply.code(204).send();
      } catch (error) {
        reply.unauthorized(error.message);
      }
    }
  }
}

export function deleteQuestion() {
  return {
    method: 'DELETE',
    url: '/:quizId/questions',
    schema: quizzesSchema.deleteQuestionSchema,
    handler: async (request, reply) => {
      const { quizId } = request.params;
      const { userId } = request.account;
      const { questionId } = request.body;
      
      try {
        const quiz = await quizzesService.findQuizOfUserOrFail({ quizId, userId });
        
        quiz.questions = _.filter(quiz.questions, ({ _id }) => _id.toString() !== questionId);

        await quiz.save();

        reply.code(204).send();
      } catch (error) {
        reply.unauthorized(error.message);
      }
    }
  }
}

export default async (app) => {
  app.route(fetchOneQuiz(app));
  app.route(findAllQuizzes(app));
  app.route(createOneQuiz(app));
  // Questions module
  app.route(createQuestion(app));
  app.route(updateQuestion(app));
  app.route(deleteQuestion(app));
}
