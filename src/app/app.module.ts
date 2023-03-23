import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#1890ff',
  },
};
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NzSwitchModule, FormsModule],
  providers: [{ provide: NZ_CONFIG, useValue: ngZorroConfig }],
  bootstrap: [AppComponent],
})
export class AppModule {}
