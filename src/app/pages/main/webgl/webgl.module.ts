import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {SharedModuleModule} from "../../../shared-module/shared-module.module";
import {WebglComponent} from "./webgl.component";
import {WEBGL_ROUTER_CONFIG} from "./webgl-routing.module";
import {QuneeComponent} from './qunee/qunee.component';

const COMPONENT = [WebglComponent, QuneeComponent];

@NgModule({
  declarations: [...COMPONENT],
  imports: [
    RouterModule.forChild(WEBGL_ROUTER_CONFIG),
    SharedModuleModule,
  ]
})
export class WebglModule {
}
