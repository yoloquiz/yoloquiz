import mongoose, { Model } from 'mongoose';
import { questionsSchema } from '../quizzes/questions/questions.model.js';

const { model, Schema } = mongoose;


const anwserChoiceSchema = new Schema({
  question: {
    type: questionsSchema,
    required: true
  },
  choice: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    required: true,
  },
});

const userAnswerHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    answers: [anwserChoiceSchema],
  }
);

const gameSessionsSchema = new Schema({
  users: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }],
  owner: {
    types: Schema.Types.ObjectId,
    ref: 'Users'
  },
  userAnswerHistory: [userAnswerHistorySchema],
  isOpened: {
    type: Boolean,
    required: true,
  },
  gameStatus: {
    type: String,
    enum: ['started', 'finished'],
    default: 'sarted'
  }
});

export default model('GameSession', gameSessionsSchema);


