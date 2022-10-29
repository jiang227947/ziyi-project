import {NgModule} from '@angular/core';
import {ExceptionRoutingModule} from './exception-routing.module';
import {Exception404Component} from './404.component';
import {SharedModuleModule} from '../../shared-module/shared-module.module';

const COMPONENTS = [Exception404Component];

@NgModule({
  imports: [SharedModuleModule, ExceptionRoutingModule],
  declarations: [...COMPONENTS]
})
export class ExceptionModule {
}
