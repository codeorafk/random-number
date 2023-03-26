import {
  Component,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { RandomsComponent } from './randoms/randoms.component';
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

  get selectedApp() {
    const component = this.componentList?.get(this.selectedId) as
      | RandomsComponent
      | undefined;
    return component ?? undefined;
  }
  selectedId = 0;
  apps: AppType[] = new Array(10)
    .fill(0)
    .map((_, idx) => ({ id: idx } as AppType));
}
