import { Component, EventEmitter, Input, OnDestroy, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { IconDefinition, faCoins, faSterlingSign } from '@fortawesome/free-solid-svg-icons';
import { RandomComponent, RandomType } from '../random/random.component';
export interface EndRandResult {
  result: number[],
  n_number: number,
  type: RandomType,
  id?: number
}
@Component({
  selector: 'app-randoms',
  templateUrl: './randoms.component.html',
  styleUrls: ['./randoms.component.less']
})
export class RandomsComponent implements OnDestroy {
  @ViewChild('container') container!: TemplateRef<unknown>;
  @ViewChildren(RandomComponent)  componentList!: QueryList<RandomComponent>;
  @Input() id?: number;
  @Input() readonly = false;
  @Input() idx? = 0
  @Output() endRandom = new EventEmitter<EndRandResult>()
  tabs: {title:string, icon: IconDefinition, type: RandomType}[] = [
    {
      title: 'binary',
      icon: faCoins,
      type: 'binary'
    },
    {
      title: 'decimal',
      icon: faSterlingSign,
      type: 'decimal'
    }
  ]

  ngOnDestroy(): void {
    this.componentList.forEach(component => component.ngOnDestroy())
  }

  getContainer(idx:number) {
    if(!this.componentList) return null;
    const component = this.componentList.get(idx)
    if(!component) return null;
    component.id = this.id
    return component.container;
  }

  getReadonlyContainer(idx: number) {
    if(!this.componentList) return null;
    const component = this.componentList.get(idx)
    if(!component) return null;
    component.id = this.id;
    return component.readonlyContainer;
  }

  onEndRandom(e: any, type: RandomType, id: number | undefined) {
    this.endRandom.emit(
      {
        result: e.result,
        n_number: e.n_number,
        type: type,
        id: id
      }
    )
  }
}
