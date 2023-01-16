import {Routes} from '@angular/router';
import {Exception404Component} from './404.component';

export const EXCEPTION_ROUTER_CONFIG: Routes = [
  {
    path: '404',
    component: Exception404Component
  }
];
