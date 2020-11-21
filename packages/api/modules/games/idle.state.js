import { race, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators/index.js';

import { getGameStartMessage$ } from './idle.functions.js';

export function onIdleState(context) {
  console.log('\n\nonIdleState :::', { owner: context.ownerUserId });
  const { messages$, start, ownerUserId } = context;

  getGameStartMessage$({ messages$, ownerUserId })
    .subscribe(() => {
      start();
    });
}
