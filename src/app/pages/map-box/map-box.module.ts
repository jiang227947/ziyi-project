import {NgModule} from '@angular/core';
import {MapBoxComponent} from "./map-box.component";
import {SharedModuleModule} from "../../shared-module/shared-module.module";
import {MapBoxRoutingModule} from "./map-box-routing.module";
import {AppGlobalMapBoxRef, BrowserGlobalMapBoxRef} from "./map-box-loader.service";

@NgModule({
  declarations: [
    MapBoxComponent
  ],
  imports: [
    MapBoxRoutingModule,
    SharedModuleModule,
  ],
  providers: [
    {
      provide: AppGlobalMapBoxRef, useClass: BrowserGlobalMapBoxRef
    }
  ]
})
export class MapBoxModule {
}
