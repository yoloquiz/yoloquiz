import { BehaviorSubject, Observable, Subject } from 'rxjs';

async function rxTests() {
  const players$ = new BehaviorSubject([]);
  players$.pipe((...props) => {
    console.log(props);
  });
  players$.subscribe((...props) => console.log(props));
  players$.next({ a: 2 });
}

rxTests();