import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const Users = Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    googleId: {
      type: String,
      select: false,
    },
    googleAccessToken: {
      type: String,
      select: false,
    },
    googleRefreshToken: {
      type: String,
      select: false,
    },
    facebookId: {
      type: String,
      select: false,
    },
    facebookAccessToken: {
      type: String,
      select: false,
    },
    facebookRefreshToken: {
      type: String,
      select: false,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    unreachable: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

export default model('Users', Users);
