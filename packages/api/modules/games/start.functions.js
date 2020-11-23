import { take, filter } from "rxjs/operators/index.js";

import { getOwnerMessage$ } from "./idle.functions.js";
import { messageType } from './messages.constants.js';

export function createGameCancelMessage() {
  return {
    name: 'game-canceled',
  };
}

export function createTimerMessage({ timeout }) {
  return {
    name: 'game-timer',
    payload: { timeout },
  };
}

export const getCanceledMessage$ = ({ messages$ }) => messages$
  .pipe(
    filter(({ name }) => name === messageType.gameCancel)
  );

export const getOwnerCanceledMessage$ = ({ messages$, ownerUserId }) => {
  const ownerMessage$ = getOwnerMessage$({ messages$, ownerUserId });
  
  return getCanceledMessage$({ messages$: ownerMessage$ })
    .pipe(
      take(1),
  );
};
