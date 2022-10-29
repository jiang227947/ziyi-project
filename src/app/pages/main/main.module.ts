import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MAIN_ROUTER_CONFIG} from './main-routing.module';
import {MainComponent} from './main.component';
import {IconsProviderModule} from '../../icons-provider.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {SharedModuleModule} from '../../shared-module/shared-module.module';


@NgModule({
  declarations: [MainComponent],
  imports: [
    RouterModule.forChild(MAIN_ROUTER_CONFIG),
    SharedModuleModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule
  ]
})
export class MainModule {
}
