import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, delay, tap } from 'rxjs';

const HISTORY_LIST = 'historyList';
const LIST_COIN = 'listCoin';
const N_COIN = 'n_coin';
const VALUE0 = 'value0';
const VALUE1 = 'value1';
const FROM = 'from';
const TO = 'to';
const N_NUMBER = 'n-number';
export const binToDec = (
  bin: number,
  n_number: number,
  randomType: RandomType
) => {
  if (randomType === 'binary') return bin.toString(2).padStart(n_number, '0');
  return bin;
};
export type RandomType = 'binary' | 'decimal';
@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.less'],
})
export class RandomComponent implements OnDestroy, OnInit {
  @ViewChild('container') container!: TemplateRef<unknown>;
  @ViewChild('readonlyContainer') readonlyContainer!: TemplateRef<unknown>;
  @Input() id?: number;
  // @Input() from = 0;
  // @Input() to = 1;
  @Input() timeout = 0.00000001;
  @Input() randomType: RandomType = 'binary';
  @Output() endRandom = new EventEmitter();

  randomFrom$ = new BehaviorSubject<number>(0);
  randomTo$ = new BehaviorSubject<number>(1);
  n_number = 1;
  n_number_temp = 1;

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

  ngOnInit(): void {
    this.listCoin =
      this.getFromLocalStorage(LIST_COIN, this.id ?? 0, this.randomType) ?? [];
    this.historyList =
      this.getFromLocalStorage(HISTORY_LIST, this.id ?? 0, this.randomType) ??
      [];
    this.n_coin =
      this.getFromLocalStorage(N_COIN, this.id ?? 0, this.randomType) ?? 0;

    this.value0 =
      this.getFromLocalStorage(VALUE0, this.id ?? 0, this.randomType) ?? false;
    this.value1 =
      this.getFromLocalStorage(VALUE1, this.id ?? 0, this.randomType) ?? false;
    const values = this.values$.value;
    if (this.value0) values.push(0);
    if (this.value1) values.push(1);
    this.values$.next(values);
    this.n_coin$.next(this.n_coin ?? 0);

    const from = this.getFromLocalStorage(FROM, this.id ?? 0, this.randomType);
    const to = this.getFromLocalStorage(TO, this.id ?? 0, this.randomType);
    if (from && _.isNumber(+from)) this.randomFrom$.next(from);
    if (to && _.isNumber(+to)) this.randomTo$.next(to);

    const n_number = this.getFromLocalStorage(
      N_NUMBER,
      this.id ?? 0,
      this.randomType
    );
    if (n_number && _.isNumber(+n_number)) {
      this.n_number = n_number;
      this.n_number_temp = n_number;
    }

    this.randomList(this.timeout).subscribe();
  }
  ngOnDestroy(): void {
    this.saveToLocalStorage(
      LIST_COIN,
      this.listCoin,
      this.id ?? 0,
      this.randomType
    );
    this.saveToLocalStorage(
      HISTORY_LIST,
      this.historyList,
      this.id ?? 0,
      this.randomType
    );
    this.saveToLocalStorage(N_COIN, this.n_coin, this.id ?? 0, this.randomType);
    this.saveToLocalStorage(VALUE0, this.value0, this.id ?? 0, this.randomType);
    this.saveToLocalStorage(VALUE1, this.value1, this.id ?? 0, this.randomType);
    this.saveToLocalStorage(
      FROM,
      this.randomFrom$.value,
      this.id ?? 0,
      this.randomType
    );
    this.saveToLocalStorage(
      TO,
      this.randomTo$.value,
      this.id ?? 0,
      this.randomType
    );
    this.saveToLocalStorage(
      N_NUMBER,
      this.n_number,
      this.id ?? 0,
      this.randomType
    );
  }
  randomOne(n: number, from: number | undefined, to: number | undefined) {
    if (from === undefined || to === undefined) return [];
    return new Array(n)
      .fill(0)
      .map((_) => Math.floor(Math.random() * (to + 1 - from)) + from);
  }
  randomList(timeout: number) {
    return combineLatest({
      loop: this.loop$,
      test: this.isStart$,
      n: this.n_coin$,
      values: this.values$,
      randomFrom: this.randomFrom$,
      randomTo: this.randomTo$,
    }).pipe(
      delay(timeout * 1000),
      tap(({ test, n, values, loop, randomFrom, randomTo }) => {
        if (loop && test) {
          const e = this.randomOne(n, randomFrom, randomTo);
          const endCond = this.endCondition(
            e,
            values,
            this.n_number_temp > 0 ? this.n_number_temp : this.n_number
          );
          if (this.isStart$.value) {
            switch (this.randomType) {
              case 'binary':
                this.n_number =
                  this.n_number_temp > 0 ? this.n_number_temp : this.n_number;
                break;
              case 'decimal':
                this.n_number =
                  Math.max(Math.log10(randomFrom), Math.log10(randomTo)) + 1;
                break;
            }

            this.listCoin = e;
            this.historyList.unshift(e);
            if (this.historyList.length > 50) {
              this.historyList.splice(50, 1);
            }
          }
          if (endCond) {
            this.endRandom.emit({
              result: e,
              n_number: this.n_number,
            });
            this.isStart$.next(false);
            this.loop$.next(false);
          } else {
            this.loop$.next(true);
          }
        }
      })
    );
  }

  endCondition(listCoin: number[], values: number[], n_number: number) {
    switch (this.randomType) {
      case 'binary':
        if (!values.length) return true;
        return values.some((value) =>
          listCoin.every((coin) => this.binaryCheck(coin, value, n_number))
        );
      case 'decimal':
        if (!listCoin.length) return true;
        const firstValue = listCoin[0];
        return listCoin.every((coin) => coin === firstValue);
    }
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
    const values = this.values$.value;
    const idx = values.findIndex((value) => n === value);
    if (idx === -1) {
      values.push(n);
    } else {
      values.splice(idx, 1);
    }
    this.values$.next(values);
  }

  saveToLocalStorage(field: string, value: any, id: number, type: RandomType) {
    localStorage.setItem(
      [field, id.toString(), type].join('_'),
      JSON.stringify(value)
    );
  }

  getFromLocalStorage(field: string, id: number, type: RandomType) {
    const valueTemp = localStorage.getItem(
      [field, id.toString(), type].join('_')
    );
    return valueTemp ? JSON.parse(valueTemp) : undefined;
  }

  randomFromChange(value: number) {
    this.randomFrom$.next(value);
  }

  randomToChange(value: number) {
    this.randomTo$.next(value);
  }

  numberOfCoin(value: number) {
    if (value < 1) return;
    const to = Math.pow(2, value) - 1;
    this.randomTo$.next(to);
  }

  binaryCheck(coin: number, value: number, n_number: number) {
    if (value === 0) return coin === 0;
    if (value === 1) return coin === Math.pow(2, n_number) - 1;
    return true;
  }

  binToDec = binToDec;
}
