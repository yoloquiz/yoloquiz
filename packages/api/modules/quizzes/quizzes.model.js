import mongoose from 'mongoose';
import softDeletePlugin from 'mongoose-delete';

const { model, Schema } = mongoose;

const attachmentSchema = new Schema({
  type: {
    type: String,
    enum: ['image'],
    default: 'image',
  },
  url: {
    type: String,
  },
});

const answersSchema = new Schema({
  choices: {
    choices: [{
      isCorrectAnswer: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
      },
    }],
  },
});

const questionsSchema = new Schema(
  {
    question: {
      type: String,
    },
    attachment: attachmentSchema,
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

const quizzesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    countPlayed: {
      type: Number,
      required: true,
      default: 0,
    },
    tags: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    questions: [questionsSchema],
  },
  { timestamps: true },
);

quizzesSchema.plugin(softDeletePlugin, {
  indexFields: true,
  overrideMethods: true,
  deletedAt: true,
  // deletedBy: true,
});

export default model('Quizzes', quizzesSchema);
