import { getGameStartMessage$ } from './idle.functions.js';

export function onIdleState(context) {
  const { messages$, start, ownerUserId } = context;

  getGameStartMessage$({ messages$, ownerUserId })
    .subscribe(() => {
      start();
    });
}
