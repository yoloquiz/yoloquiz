import { filter } from "rxjs/operators/index.js";

export const getOwnerMessage$ = ({ messages$, ownerUserId }) => messages$
  .pipe(
    filter(({ userId }) => userId === ownerUserId),
  );