import {NgModule} from '@angular/core';
import {ConvenientToolComponent} from './convenient-tool.component';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {TOOL_ROUTER_CONFIG} from './convenient-tool-routing.module';
import {ConversionComponent} from './conversion/conversion.component';
import {LuckysheetComponent} from './luckysheet/luckysheet.component';

const COMPONENT = [ConvenientToolComponent, ConversionComponent, LuckysheetComponent];

@NgModule({
  declarations: [...COMPONENT],
  imports: [
    SharedModuleModule,
    RouterModule.forChild(TOOL_ROUTER_CONFIG),
  ]
})
export class ConvenientToolModule {
}
