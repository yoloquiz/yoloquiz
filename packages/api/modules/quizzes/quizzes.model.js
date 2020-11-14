import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const quizzesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tags: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Questions',
      },
    ],
  },
  { timestamps: true },
);

export default model('Quizzes', quizzesSchema);
