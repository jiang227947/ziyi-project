import {Routes} from '@angular/router';
import {ChatChannelsComponent} from './chat-channels/chat-channels.component';

export const CHAT_CHANNELS_ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: ChatChannelsComponent,
    children: []
  },
];
