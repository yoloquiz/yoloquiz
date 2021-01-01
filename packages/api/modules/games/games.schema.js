import schema from 'fluent-schema';
import { id } from '../shared/common.schema.js';

export const createGameRoomSchema = {
  body: schema.object()
    .prop('quizId', id.required())
    .valueOf(),
};
