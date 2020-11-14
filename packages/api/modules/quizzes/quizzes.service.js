import quizModel from './quizzes.model.js';

export function createOneQuiz({ quiz, user }) {
  return quizModel.create(quiz);
}

export function updateOneQuiz({ quiz }) {
  return quizModel.updateOne(quiz);
}

export function removeOneQuizById({ quizId }) {
  return quizModel.findOneAndRemove({ _id: quizId });
}

export function findOneQuizById({ quizId }) {
  return quizModel.findOne({ _id: quizId });
}

export function findAllQuizzes() {
  return quizModel.find();
}
