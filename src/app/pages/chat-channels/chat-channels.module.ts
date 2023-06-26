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
import {NzPopoverModule} from 'ng-zorro-antd/popover';
/*service*/
import {ChatRequestService} from '../../core-module/api-service/chat';
import {ChatBaseOperateService} from './config/chat-base-operate.service';
import {IndexApiService} from '../main/index/service/indexApiService';
import {UserInfoboxComponent} from './components/user-infobox/user-infobox.component';

const COMPONENTS = [
  ChatChannelsComponent,
  ChatSidebarComponent,
  ChatBaseComponent,
  CreateChannelComponent,
  SettingChannelComponent,
  UserInfoboxComponent
];

const PIPES = [DateConversionPipe, TimeConversionPipe];

const SERVICE = [
  ChatRequestService,
  ChatBaseOperateService,
  IndexApiService
];

const NZMODULE = [
  NzSkeletonModule,
  NzMentionModule,
  NzSwitchModule,
  NzPopoverModule
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  imports: [
    SharedModuleModule,
    RouterModule.forChild(CHAT_CHANNELS_ROUTER_CONFIG),
    InfiniteScrollModule,
    ...NZMODULE
  ],
  providers: [...SERVICE],
})
export class ChatChannelsModule {
}
