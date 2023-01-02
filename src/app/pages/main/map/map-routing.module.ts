import {Routes} from '@angular/router';
import {GMapComponent} from './g-map/g-map.component';
import {AmapComponent} from './amap/amap.component';
import {MapBoxComponent} from './map-box/map-box.component';
import {BmapComponent} from './bmap/bmap.component';
import {LeafletComponent} from './leaflet/leaflet.component';

export const MAP_ROUTER_CONFIG: Routes = [
  {path: '', redirectTo: 'aMap', pathMatch: 'full'},
  {path: 'aMap', component: AmapComponent},
  {path: 'bMap', component: BmapComponent},
  {path: 'mapBox', component: MapBoxComponent},
  {path: 'gMap', component: GMapComponent},
  {path: 'leafletMap', component: LeafletComponent},
];
