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

export function deleteQuizOfUser({ quizId, userId }) {
  return quizModel.delete({ _id: quizId, owner: userId });
}

export function findOneQuizById({ quizId }) {
  return quizModel.findOne({ _id: quizId });
}

export async function findQuizOfUserOrFail({ userId, quizId }) {
  const quiz = await quizModel.findOne({ _id: quizId, owner: userId });
  if (!quiz) throw new Error('Not found or not allowed');
  return quiz;
}

export function findAllQuizzesOfUser({ userId }) {
  return quizModel.find({ owner: userId });
}

export function incrementQuizPlayedCounter({ quizId }) {
  return quizModel.findOneAndUpdate({ _id: quizId }, {
    $inc: {
      countPlayed: 1,
    }
  }).exec();
}
