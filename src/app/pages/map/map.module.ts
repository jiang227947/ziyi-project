import {NgModule} from '@angular/core';
import {GMapComponent} from "./g-map/g-map.component";
import {MapComponent} from "./map/map.component";
import {SharedModuleModule} from "../../shared-module/shared-module.module";
import {GlobalModule} from "./global.module";
import {AmapComponent} from "./amap/amap.component";
import {MapRoutingModule} from "./map-routing.module";

const COMPONENTS = [
  GMapComponent,
  MapComponent,
  AmapComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModuleModule,
    MapRoutingModule,
    GlobalModule.forBrowser(),
  ]
})
export class MapModule {
}
