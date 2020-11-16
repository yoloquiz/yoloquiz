import usersModel from './users.model.js';

export function findOneByEmail({ email }) {
  return usersModel.findOne({ email }).select('-password');
}

export function findOneById({ userId }) {
  return usersModel.findOne({ _id: userId }).select('-password');
}

export function createUser({ email, password, firstName, lastName }) {
  return usersModel.create({
    email,
    password,
    privateProfile: {
      firstName,
      lastName,
    },
  });
}