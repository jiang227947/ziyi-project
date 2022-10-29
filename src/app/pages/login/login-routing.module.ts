import {Routes} from '@angular/router';
import {LoginComponent} from './login.component';
import {AuthComponent} from './auth/auth.component';

export const LOGIN_ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {path: '', redirectTo: 'auth', pathMatch: 'full'},
      {
        path: 'auth',
        component: AuthComponent
      }
    ]
  },
];

