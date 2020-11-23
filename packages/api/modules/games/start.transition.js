import { race, timer } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators/index.js';

import { createPlayerReadyMessage, getAllPlayersReady$, getPlayerReadyMessage$ } from './idle.functions.js';
import { getOwnerCanceledMessage$, createGameCancelMessage, createTimerMessage } from './start.functions.js';

export async function onStartTransition(context) {
  const { timeout, messages$, players$, ownerUserId, sendToEveryone } = context;

  const timer$ = timer(timeout);

  sendToEveryone({
    message: createTimerMessage({ timeout }),
  });

  const ownerCanceled$ = getOwnerCanceledMessage$({ messages$, ownerUserId })
  const playerReadyMessage$ = getPlayerReadyMessage$({ messages$ });
  const allPlayersReady$ = getAllPlayersReady$({ playerReadyMessage$, players$ });

  const allPlayersReadyOrTimeout$ = race(
    ownerCanceled$
      .pipe(
        tap(() => sendToEveryone({
          message: createGameCancelMessage(),
        })),
        map(() => ({ isCanceled: true })),
      ),
    allPlayersReady$,
    timer$,
  );

  playerReadyMessage$
    .pipe(
      takeUntil(allPlayersReadyOrTimeout$),
  ).subscribe(({ userId, payload }) => {
      const { isReady } = payload;

      sendToEveryone({
        message: createPlayerReadyMessage({ playerId: userId, isReady }),
        without: [userId],
      });
    });

  const { isCanceled = false } = await allPlayersReadyOrTimeout$.toPromise();

  if (isCanceled) throw new Error('Game launch canceled');
}
