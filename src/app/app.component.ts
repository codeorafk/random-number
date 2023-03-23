import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, delay, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  from = 0;
  to = 1;
  timeout = 0.1;

  value0 = false;
  value1 = false;
  n_coin?: number;
  n_coinValidate?: boolean;
  n_coin$ = new BehaviorSubject<number>(0);

  values$ = new BehaviorSubject<number[]>([]);

  historyList: number[][] = [];
  listCoin: number[] = [];
  isStart$ = new BehaviorSubject<boolean>(false);
  loop$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.randomList(this.from, this.to, this.timeout).subscribe();
  }

  randomOne(n: number, from: number, to: number) {
    return new Array(n)
      .fill(0)
      .map((_) => Math.floor(Math.random() * (to + 1 - from)) + from);
  }

  randomList(from: number, to: number, timeout: number) {
    return combineLatest({
      loop: this.loop$,
      test: this.isStart$,
      n: this.n_coin$,
      values: this.values$,
    }).pipe(
      delay(timeout * 1000),
      tap(({ test, n, values, loop }) => {
        if (loop && test) {
          const e = this.randomOne(n, from, to);
          const endCond = this.endCondition(e, values);
          if (this.isStart$.value) {
            this.listCoin = e;
            this.historyList.unshift(e);
            if (this.historyList.length > 50) {
              this.historyList.splice(50, 1);
            }
          }
          if (endCond) {
            this.isStart$.next(false);
            this.loop$.next(false);
          } else {
            this.loop$.next(true);
          }
        }
      })
    );
  }

  endCondition(listCoin: number[], values: number[]) {
    if (!values.length) return true;
    return values.some((value) => listCoin.every((coin) => coin === value));
  }

  n_coinChange() {
    this.n_coin$.next(this.n_coin ?? 0);
  }

  start() {
    if (!this.n_coin) {
      this.n_coinValidate = true;
    }
    this.isStart$.next(true);
    this.loop$.next(true);
  }

  end() {
    this.isStart$.next(false);
  }

  setValue(n: number) {
    console.log('aaa');
    const values = this.values$.value;
    const idx = values.findIndex((value) => n === value);
    if (idx === -1) {
      values.push(n);
    } else {
      values.splice(idx, 1);
    }
    console.log(values);
    this.values$.next(values);
    console.log(this.values$.value);
  }
}
