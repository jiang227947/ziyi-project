import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './index.component';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './index-routing.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
})
export class IndexModule {
}
