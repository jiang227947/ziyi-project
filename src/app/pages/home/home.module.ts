import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {HOME_ROUTER_CONFIG} from './home-routing.module';
import {HomeComponent} from './home.component';

@NgModule({
  declarations: [HomeComponent],
    imports: [
        SharedModuleModule,
        RouterModule.forChild(HOME_ROUTER_CONFIG)
    ],
})
export class HomeModule {
}
