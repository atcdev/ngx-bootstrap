/**
 * @copyright ngrx
 */
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Action, ActionReducer } from './index';
import { observeOn } from 'rxjs/operators';
import { queue } from 'rxjs';
import { scan } from 'rxjs/operators';

export class MiniState<T> extends BehaviorSubject<T> {
  constructor(
    _initialState: T,
    actionsDispatcher$: Observable<Action>,
    reducer: ActionReducer<T>
  ) {
    super(_initialState);

    const actionInQueue$ = observeOn.call(actionsDispatcher$, queue);
    const state$ = scan.call(
      actionInQueue$,
      (state: T, action: Action) => {
        if (!action) {
          return state;
        }

        return reducer(state, action);
      },
      _initialState
    );

    state$.subscribe((value: T) => this.next(value));
  }
}
