import {
  Component,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { delay, of, tap } from 'rxjs';
import { binToDec } from './random/random.component';
import { EndRandResult, RandomsComponent } from './randoms/randoms.component';
interface AppType {
  id: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  @ViewChildren(RandomsComponent) componentList!: QueryList<RandomsComponent>;
  @HostListener('window:beforeunload')
  destroyAll() {
    this.componentList.forEach((component) => component.ngOnDestroy());
  }
  constructor(private popup: NzModalService) {}

  selectedApp? :RandomsComponent

  apps: AppType[] = new Array(10)
    .fill(0)
    .map((_, idx) => ({ id: idx } as AppType));

  notificate(e: EndRandResult, appRandom: RandomsComponent) {
    this.popup.confirm({
      nzTitle: `<b>Tự động random đã kết thúc</b>`,
      nzContent: `Kết quả là ${e.result.map(number => binToDec(number, e.n_number, e.type)).join(', ')}. Bạn có muốn xem lại lịch sử không?`,
      nzOkText:'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.goToApp(appRandom, e)
      }
    })
  }
  onClickApp(id: number, tabIdx?: number) {
    const component = this.componentList?.get(id) as
    | RandomsComponent
    | undefined;
    if(tabIdx && component) component.idx = tabIdx
    console.log(component)
    this.selectedApp =  component ?? undefined;
  }
  goToApp(app: RandomsComponent, e: EndRandResult) {
    of(e.id).pipe(
      delay(300),
      tap(id=> {
        const el = document.getElementById('app-random_'+( id ?? 0).toString())
        el?.scrollIntoView({behavior: 'smooth'});
        app.idx = e.type === 'decimal' ? 1 : 0;
        this.onClickApp(e.id ?? 0, e.type === 'decimal' ? 1 : 0)
      })
    ).subscribe()
  }

  binToDec = binToDec
}
