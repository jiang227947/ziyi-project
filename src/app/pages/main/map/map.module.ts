import {NgModule} from '@angular/core';
import {GMapComponent} from './g-map/g-map.component';
import {MapComponent} from './map/map.component';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';
import {GlobalModule} from './global.module';
import {AmapComponent} from './amap/amap.component';
import {MAP_ROUTER_CONFIG} from './map-routing.module';
import {AppGlobalMapBoxRef, BrowserGlobalMapBoxRef} from './service/map-box-loader.service';
import {MapBoxComponent} from './map-box/map-box.component';
import {RouterModule} from '@angular/router';

const COMPONENTS = [
  GMapComponent,
  MapComponent,
  MapBoxComponent,
  AmapComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModuleModule,
    RouterModule.forChild(MAP_ROUTER_CONFIG),
    GlobalModule.forBrowser(),
  ],
  providers: [
    {
      provide: AppGlobalMapBoxRef, useClass: BrowserGlobalMapBoxRef
    }
  ]
})
export class MapModule {
}
