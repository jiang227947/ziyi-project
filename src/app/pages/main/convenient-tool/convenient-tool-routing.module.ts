import {Routes} from "@angular/router";
import {ConversionComponent} from "./conversion/conversion.component";
import {SimpleGuardService} from "../../../core-module/service/simple-guard.service";
import {ConvenientToolComponent} from "./convenient-tool.component";

export const TOOL_ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: ConvenientToolComponent,
    canActivate: [SimpleGuardService],
    children: [
      {path: '', redirectTo: 'conversion', pathMatch: 'full'},
      // 数据转换
      {
        path: 'conversion', component: ConversionComponent
      }
    ]
  },

];
