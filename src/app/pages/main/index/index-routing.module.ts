/**
 * Created by jzy 2022年10月26日10:47:14
 */
import {Routes} from '@angular/router';
import {IndexComponent} from './index.component';
import {AccountCenterComponent} from './account-center/account-center.component';

export const INDEX_ROUTER_CONFIG: Routes = [
  {
    path: 'index',
    component: IndexComponent
  },
  {
    path: 'account-center',
    component: AccountCenterComponent
  },
];
