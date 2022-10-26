import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/gMap'},
  {path: 'CAD', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)},
  {path: 'map', loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)},
  {path: 'mapBox', loadChildren: () => import('./pages/map-box/map-box.module').then(m => m.MapBoxModule)},
  {path: 'weather', loadChildren: () => import('./pages/q-weather/q-weather.module').then(m => m.QWeatherModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
