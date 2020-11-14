import usersModel from './users.model.js';

export function findOneByEmail({ email }) {
    return usersModel.findOne({ email });
}

export function findOneById({ userId }) {
  return usersModel.findOne({ _id: userId });
}
