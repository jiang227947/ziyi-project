import {Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {SimpleGuardService} from '../../core-module/service/simple-guard.service';

export const MAIN_ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [SimpleGuardService],
    children: [
      {path: '', redirectTo: 'index', pathMatch: 'full'},
      // 首页
      {
        path: 'index',
        canActivateChild: [SimpleGuardService],
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
      },
      // CAD
      {
        path: 'cad',
        canActivateChild: [SimpleGuardService],
        loadChildren: () => import('./cad/cad.module').then(m => m.CadModule)
      },
      // 地图
      {
        path: 'map',
        canActivateChild: [SimpleGuardService],
        loadChildren: () => import('./map/map.module').then(m => m.MapModule)
      },
      // 和风天气
      {
        path: 'weather',
        canActivateChild: [SimpleGuardService],
        loadChildren: () => import('./q-weather/q-weather.module').then(m => m.QWeatherModule)
      },
      // 用户管理
      {
        path: 'user-management',
        canActivateChild: [SimpleGuardService],
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule)
      },
      // webgl
      {
        path: 'webgl',
        canActivateChild: [SimpleGuardService],
        loadChildren: () => import('./webgl/webgl.module').then(m => m.WebglModule)
      }
    ]
  }
];

