import { race, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators/index.js';

import { getPlayerReadyMessage$, getAllPlayersReady$ } from './idle.functions.js';

export function onIdleState(context) {
  const { $, sendToEveryone, start } = context;
  const { messages$, players$ } = $;

  const timer$ = timer(30 * 1000); // 30 seconds

  const playerReadyMessage$ = getPlayerReadyMessage$({ messages$ });
  const allPlayersReady$ = getAllPlayersReady$({ playerReadyMessage$, players$ });
  const allPlayersReadyOrTimeout$ = race(
    allPlayersReady$,
    timer$,
  );

  playerReadyMessage$
    .pipe(
      takeUntil(allPlayersReadyOrTimeout$),
    ).subscribe(({ userId, payload }) => {
      console.log('okokokokokokok', userId);
      const { isReady } = payload;

      sendToEveryone({
        message: createPlayerReadyMessage({ playerId: userId, isReady }),
        without: [userId],
      });
    });

  allPlayersReadyOrTimeout$.subscribe(() => {
    console.log('Start');
    start();
  });
}