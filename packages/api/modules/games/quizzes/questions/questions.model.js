import { model, Schema } from 'mongoose';

const answersSchema = new Schema({
  choices: {
    choices: [
      {
        key: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    validChoices: [
      {
        type: String,
        required: true,
      },
    ],
  },
});

export const questionsSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    tags: [
      {
        name: {
          type: String,
          required: true,
          index: true,
        },
      },
    ],
    format: {
      type: String,
      enum: ['choices'],
      default: 'choices',
    },
    answers: {
      type: answersSchema,
      required: true,
    },
  },
  { timestamps: true },
);

export default model('Questions', questionsSchema);
