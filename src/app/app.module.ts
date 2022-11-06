import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {zh_CN} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {DefaultInterceptor} from './core-module/interceptor/default.interceptor';
import {SharedModuleModule} from './shared-module/shared-module.module';
import {SimpleGuardService} from './core-module/interceptor/simple-guard.service';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModuleModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    /* 提供拦截器*/
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultInterceptor,
      multi: true,
    },
    /* 路由守卫*/
    SimpleGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
