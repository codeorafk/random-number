import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'ud-tabset',
  standalone: true,
  imports: [CommonModule, NzTabsModule],
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.less']
})
export class TabsetComponent {

}
