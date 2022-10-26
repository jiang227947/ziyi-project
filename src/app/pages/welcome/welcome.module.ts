import {NgModule} from '@angular/core';
import {WelcomeRoutingModule} from './welcome-routing.module';
import {WelcomeComponent} from './welcome.component';
import {SharedModuleModule} from "../../shared-module/shared-module.module";


@NgModule({
  imports: [
    WelcomeRoutingModule,
    SharedModuleModule
  ],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule {
}
