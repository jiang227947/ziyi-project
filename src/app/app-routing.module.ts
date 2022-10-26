import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/home'},
  {path: 'home', loadChildren: () => import('./pages/index/index.module').then(m => m.IndexModule)},
  {path: 'cad', loadChildren: () => import('./pages/cad/cad.module').then(m => m.CadModule)},
  {path: 'map', loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)},
  {path: 'weather', loadChildren: () => import('./pages/q-weather/q-weather.module').then(m => m.QWeatherModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
