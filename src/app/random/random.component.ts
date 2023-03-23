import {
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, combineLatest, delay, tap } from 'rxjs';

const HISTORY_LIST = 'historyList';
const LIST_COIN = 'listCoin';
const N_COIN = 'n_coin';
const VALUE0 = 'value0';
const VALUE1 = 'value1';
@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.less'],
})
export class RandomComponent implements OnDestroy {
  @ViewChild('container') container!: TemplateRef<unknown>;
  @Input() id?: number;
  @Input() from = 0;
  @Input() to = 1;
  @Input() timeout = 0.1;
  @Input() readonly = false;
  value0 = false;
  value1 = false;
  n_coin = 0;
  n_coinValidate?: boolean;
  n_coin$ = new BehaviorSubject<number>(0);
  el: any;
  values$ = new BehaviorSubject<number[]>([]);

  historyList: number[][] = [];
  listCoin: number[] = [];
  isStart$ = new BehaviorSubject<boolean>(false);
  loop$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.listCoin = this.getFromLocalStorage(LIST_COIN, this.id ?? 0) ?? [];
    this.historyList =
      this.getFromLocalStorage(HISTORY_LIST, this.id ?? 0) ?? [];
    this.n_coin = this.getFromLocalStorage(N_COIN, this.id ?? 0) ?? 0;
    this.value0 = this.getFromLocalStorage(VALUE0, this.id ?? 0) ?? false;
    this.value1 = this.getFromLocalStorage(VALUE1, this.id ?? 0) ?? false;

    const values = this.values$.value;
    if (this.value0) values.push(0);
    if (this.value1) values.push(1);

    this.values$.next(values);
    this.n_coin$.next(this.n_coin ?? 0);

    this.randomList(this.from, this.to, this.timeout).subscribe();
  }

  ngOnDestroy(): void {
    this.saveToLocalStorage(LIST_COIN, this.listCoin, this.id ?? 0);
    this.saveToLocalStorage(HISTORY_LIST, this.historyList, this.id ?? 0);
    this.saveToLocalStorage(N_COIN, this.n_coin, this.id ?? 0);
    this.saveToLocalStorage(VALUE0, this.value0, this.id ?? 0);
    this.saveToLocalStorage(VALUE1, this.value1, this.id ?? 0);
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

  saveToLocalStorage(field: string, value: any, id: number) {
    localStorage.setItem(field + id.toString(), JSON.stringify(value));
  }

  getFromLocalStorage(field: string, id: number) {
    const valueTemp = localStorage.getItem(field + id.toString());
    return valueTemp ? JSON.parse(valueTemp) : undefined;
  }
}
