import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {INDEX_ROUTER_CONFIG} from './index-routing.module';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';
import {IndexApiService} from './service/indexApiService';
import {DownloadUtil} from '../../../shared-module/util/download-util';
import {OpenaiRequestService} from '../../../core-module/api-service/openai';
// PIPE
import {SafeHtmlPipe} from '../../../shared-module/pipe/safeHtml.pipe';
// COMPONENT
import {IndexComponent} from './index.component';
import {ChatGPTComponent} from './chat-gpt/chat-gpt.component';
import {AccountCenterComponent} from './account-center/account-center.component';
import {ChatChannelsModule} from '../../chat-channels/chat-channels.module';

const COMPONENTS = [IndexComponent, ChatGPTComponent, AccountCenterComponent];
const PIPES = [SafeHtmlPipe];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [
    CommonModule,
    RouterModule.forChild(INDEX_ROUTER_CONFIG),
    SharedModuleModule,
    ChatChannelsModule
  ],
  providers: [IndexApiService, DownloadUtil, OpenaiRequestService]
})
export class IndexModule {
}
