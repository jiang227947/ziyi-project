import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketIoService} from '../../../core-module/service/websocket/socket-io.service';
import {Socket} from 'socket.io-client/build/esm/socket';

@Component({
  selector: 'app-chat-channels',
  templateUrl: './chat-channels.component.html',
  styleUrls: ['./chat-channels.component.scss']
})
export class ChatChannelsComponent implements OnInit, OnDestroy {

  // 切换频道的ID
  selectActiveChannel: string = '8808';
  // socket
  socket: Socket;
  // 频道折叠
  channelsUnfold: boolean = false;

  constructor(private $socketIoService: SocketIoService) {
    this.$socketIoService.connect();
  }

  ngOnInit(): void {
    if (!this.socket) {
      this.socket = this.$socketIoService.socketIo;
    }
  }

  /**
   * 断开
   */
  socketDisconnect(isActiveChannel?: string): void {
    this.$socketIoService.socketIo.disconnect();
    this.$socketIoService.close();
    // 如果是切换频道则重新连接并赋值
    if (isActiveChannel) {
      this.$socketIoService.connect(isActiveChannel);
      this.socket = this.$socketIoService.socketIo;
    }
  }

  /**
   * 频道折叠
   * @param unfold 入参
   */
  channelUnfold(unfold: boolean): void {
    this.channelsUnfold = unfold;
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    this.$socketIoService.close();
  }
}
