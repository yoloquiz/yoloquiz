import quizModel from './quizzes.model.js';

export function createOneQuiz({ userId, name }) {
  return quizModel.create({
    owner: userId,
    name,
  });
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

export async function findQuizOfUserOrFail({ userId, quizId }) {
  const quiz = await quizModel.findOne({ _id: quizId, owner: userId });
  if (!quiz) throw new Error('Not found or not allowed');
  return quiz;
}

export function findAllQuizzes() {
  return quizModel.find();
}
