import {Routes} from '@angular/router';
import {MainComponent} from './main.component';

export const MAIN_ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [],
    children: [
      {path: '', redirectTo: 'index', pathMatch: 'full'},
      // 首页
      {path: 'index', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)},
      // CAD
      {path: 'cad', loadChildren: () => import('./cad/cad.module').then(m => m.CadModule)},
      // 地图
      {path: 'map', loadChildren: () => import('./map/map.module').then(m => m.MapModule)},
      // 和风天气
      {path: 'weather', loadChildren: () => import('./q-weather/q-weather.module').then(m => m.QWeatherModule)}
    ]
  }
];

