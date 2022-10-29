import {Routes} from '@angular/router';
import {GMapComponent} from './g-map/g-map.component';
import {AmapComponent} from './amap/amap.component';
import {MapBoxComponent} from './map-box/map-box.component';

export const MAP_ROUTER_CONFIG: Routes = [
  {path: '', redirectTo: 'aMap', pathMatch: 'full'},
  {path: 'gMap', component: GMapComponent},
  {path: 'aMap', component: AmapComponent},
  {path: 'mapBox', component: MapBoxComponent}
];
