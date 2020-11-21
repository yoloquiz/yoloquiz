import _ from 'lodash';
import rxjs from 'rxjs';
import { withLatestFrom, scan, take, filter, map } from 'rxjs/operators/index.js';

import { messageType } from './messages.constants.js';

export const createPlayerReadyMessage = ({ playerId, isReady }) => ({
  name: 'player-ready',
  payload: {
    playerId,
    isReady,
  },
});

export function areAllPlayersReady({ players }) {
  return !_.some(players, { isReady: false });
}

export const getPlayerReadyMessage$ = ({ messages$ }) => messages$
  .pipe(
    filter(({ name }) => name === messageType.playerReady),
  );

export const getAllPlayersReady$ = ({ playerReadyMessage$, players$ }) => playerReadyMessage$
  .pipe(
    withLatestFrom(players$),
    scan((acc, [playerReadyMessage, players]) => {
      const { userId, payload } = playerReadyMessage;
      const { isReady } = payload;

      const playersReady = _.mapValues(_.mapKeys(players, 'userId'), (player) => ({
        isReady: player.userId === userId ? isReady : _.get(acc, [player.userId, 'isReady'], false),
      }));

      return playersReady;
    }, {}),
    map((players) => areAllPlayersReady({ players })),
    filter((areAllPlayersReady) => !!areAllPlayersReady),
    take(1),
);
  