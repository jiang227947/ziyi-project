import {NgModule} from '@angular/core';
import {ChatChannelsComponent} from './chat-channels/chat-channels.component';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {CHAT_CHANNELS_ROUTER_CONFIG} from './chat-channels-routing.module';
import {ChatSidebarComponent} from './chat-sidebar/chat-sidebar.component';
import {ChatBaseComponent} from './chat-base/chat-base.component';
import {DateConversionPipe, TimeConversionPipe} from '../../shared-module/pipe/date.pipe';
import {ChatRequestService} from '../../core-module/api-service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NzMentionModule} from 'ng-zorro-antd/mention';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';

const COMPONENTS = [
  ChatChannelsComponent,
  ChatSidebarComponent,
  ChatBaseComponent
];

const PIPES = [DateConversionPipe, TimeConversionPipe];

const SERVICE = [ChatRequestService];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  imports: [
    SharedModuleModule,
    RouterModule.forChild(CHAT_CHANNELS_ROUTER_CONFIG),
    InfiniteScrollModule,
    NzSkeletonModule,
    NzMentionModule
  ],
  exports: [
    ChatChannelsComponent
  ],
  providers: [...SERVICE]
})
export class ChatChannelsModule {
}
