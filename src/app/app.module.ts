import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RandomComponent } from './random/random.component';
import { RandomsComponent } from './randoms/randoms.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#1890ff',
  },
};
@NgModule({
  declarations: [AppComponent, RandomComponent, RandomsComponent],
  imports: [BrowserModule, AppRoutingModule, NzSwitchModule, FormsModule, NzTabsModule, FontAwesomeModule
  ],
  providers: [{ provide: NZ_CONFIG, useValue: ngZorroConfig },],
  bootstrap: [AppComponent],
})
export class AppModule {}
