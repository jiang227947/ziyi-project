import {NgModule} from '@angular/core';
import {Exception404Component} from './404.component';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {EXCEPTION_ROUTER_CONFIG} from './exception-routing.module';

const COMPONENTS = [Exception404Component];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModuleModule,
    RouterModule.forChild(EXCEPTION_ROUTER_CONFIG)
  ]
})
export class ExceptionModule {
}
