import {Routes} from '@angular/router';
import {HomeComponent} from './home.component';

export const HOME_ROUTER_CONFIG: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    component: HomeComponent
  },
];
