import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketIoService} from '../../../core-module/service/websocket/socket-io.service';
import {Socket} from 'socket.io-client/build/esm/socket';

@Component({
  selector: 'app-chat-channels',
  templateUrl: './chat-channels.component.html',
  styleUrls: ['./chat-channels.component.scss']
})
export class ChatChannelsComponent implements OnInit, OnDestroy {

  // socket
  socket: Socket;

  constructor(private $socketIoService: SocketIoService) {
    this.$socketIoService.connect();
  }

  ngOnInit(): void {
    console.log('socketIo', this.$socketIoService.socketIo);
    if (!this.socket) {
      this.socket = this.$socketIoService.socketIo;
      console.log('this.socket', this.socket.volatile);
    }
  }

  socketDisconnect(): void {
    this.$socketIoService.socketIo.disconnect();
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    this.$socketIoService.close();
  }
}
