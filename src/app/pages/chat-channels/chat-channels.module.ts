import {NgModule} from '@angular/core';
import {ChatChannelsComponent} from './chat-channels/chat-channels.component';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {CHAT_CHANNELS_ROUTER_CONFIG} from './chat-channels-routing.module';
import {ChatSidebarComponent} from './chat-sidebar/chat-sidebar.component';
import {ChatBaseComponent} from './chat-base/chat-base.component';
import {DateConversionPipe, TimeConversionPipe} from '../../shared-module/pipe/date.pipe';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {CreateChannelComponent} from './components/create-channel/create-channel.component';
import {SettingChannelComponent} from './components/setting-channel/setting-channel.component';

/*ng-zorro-antd*/
import {NzMentionModule} from 'ng-zorro-antd/mention';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
/*service*/
import {ChatRequestService} from '../../core-module/api-service/chat';
import {ChatBaseOperateService} from './config/chat-base-operate.service';
import {IndexApiService} from '../main/index/service/indexApiService';

const COMPONENTS = [
  ChatChannelsComponent,
  ChatSidebarComponent,
  ChatBaseComponent,
  CreateChannelComponent,
  SettingChannelComponent
];

const PIPES = [DateConversionPipe, TimeConversionPipe];

const SERVICE = [
  ChatRequestService,
  ChatBaseOperateService,
  IndexApiService
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES,
  ],
  imports: [
    SharedModuleModule,
    RouterModule.forChild(CHAT_CHANNELS_ROUTER_CONFIG),
    InfiniteScrollModule,
    NzSkeletonModule,
    NzMentionModule,
    NzSwitchModule
  ],
  exports: [],
  providers: [...SERVICE],
})
export class ChatChannelsModule {
}
