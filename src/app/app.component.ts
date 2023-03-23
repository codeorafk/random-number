import {
  Component,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { RandomComponent } from './random/random.component';
interface AppType {
  id: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  @ViewChildren(RandomComponent) componentList!: QueryList<RandomComponent>;
  @HostListener('window:beforeunload')
  destroyAll() {
    this.componentList.forEach((component) => component.ngOnDestroy());
  }

  get selectedApp() {
    const component = this.componentList?.get(this.selectedId) as
      | RandomComponent
      | undefined;
    console.log(component);
    return component ?? undefined;
  }
  selectedId = 0;
  apps: AppType[] = new Array(10)
    .fill(0)
    .map((_, idx) => ({ id: idx } as AppType));
}
