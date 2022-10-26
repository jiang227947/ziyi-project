import {NgModule} from '@angular/core';
import {CadRoutingModule} from './cad-routing.module';
import {CadComponent} from './cad.component';
import {SharedModuleModule} from "../../shared-module/shared-module.module";


@NgModule({
  imports: [
    CadRoutingModule,
    SharedModuleModule
  ],
  declarations: [CadComponent],
  exports: [CadComponent]
})
export class CadModule {
}
