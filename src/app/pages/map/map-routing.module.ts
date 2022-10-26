import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {GMapComponent} from "./g-map/g-map.component";
import {AmapComponent} from "./amap/amap.component";
import {MapBoxComponent} from "./map-box/map-box.component";

const routes: Routes = [
  {path: 'gMap', component: GMapComponent},
  {path: 'aMap', component: AmapComponent},
  {path: 'mapBox', component: MapBoxComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule {
}
