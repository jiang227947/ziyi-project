import {Component, OnInit} from '@angular/core';
import {SocketIoService} from '../../../core-module/service/websocket/socket-io.service';
import {Socket} from 'socket.io-client/build/esm/socket';

@Component({
  selector: 'app-chat-channels',
  templateUrl: './chat-channels.component.html',
  styleUrls: ['./chat-channels.component.scss']
})
export class ChatChannelsComponent implements OnInit {

  // socket
  socket: Socket;

  constructor(private $socketIoService: SocketIoService) {
    this.$socketIoService.connect();
  }

  ngOnInit(): void {
    if (!this.socket) {
      this.socket = this.$socketIoService.socketIo;
    }
  }

  socketDisconnect(): void {
    this.$socketIoService.socketIo.disconnect();
  }

}
