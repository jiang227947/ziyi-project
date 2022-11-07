import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './index.component';
import {RouterModule} from '@angular/router';
import {INDEX_ROUTER_CONFIG} from './index-routing.module';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(INDEX_ROUTER_CONFIG),
    SharedModuleModule
  ],
})
export class IndexModule {
}
