import {NgModule} from '@angular/core';
import {CadComponent} from './cad.component';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {CAD_ROUTER_CONFIG} from './cad-routing.module';


@NgModule({
  imports: [
    RouterModule.forChild(CAD_ROUTER_CONFIG),
    SharedModuleModule
  ],
  declarations: [CadComponent],
  exports: [CadComponent]
})
export class CadModule {
}
