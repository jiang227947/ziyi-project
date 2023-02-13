import {Routes} from '@angular/router';
import {WebglComponent} from "./webgl.component";
import {QuneeComponent} from "./qunee/qunee.component";

export const WEBGL_ROUTER_CONFIG: Routes = [
  {path: '', redirectTo: 'webgl', pathMatch: 'full'},
  {
    path: 'webgl', component: WebglComponent
  },
  {
    path: 'qunee', component: QuneeComponent
  }
];
