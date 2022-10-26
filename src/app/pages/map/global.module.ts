import {ModuleWithProviders, NgModule} from '@angular/core';
import {AppGlobalRef, BrowserGlobalRef} from "./google-map-loader.service";

@NgModule()
export class GlobalModule {
  static forBrowser(): ModuleWithProviders<any> {
    return {
      ngModule: GlobalModule,
      providers: [
        {
          provide: AppGlobalRef, useClass: BrowserGlobalRef
        }
      ]
    };
  }
}

