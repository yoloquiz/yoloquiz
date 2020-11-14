import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const UserProfile = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const Users = Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: UserProfile,
      required: true,
    },
  },
  { timestamps: true},
);

export default mongoose.model('Users', Users);
