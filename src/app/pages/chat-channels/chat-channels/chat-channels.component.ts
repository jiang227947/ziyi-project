import {Component, OnInit} from '@angular/core';
import {SocketIoService} from '../../../core-module/service/websocket/socket-io.service';
import {Socket} from 'socket.io-client/build/esm/socket';
import {MessageService} from '../../../shared-module/service/Message.service';

@Component({
  selector: 'app-chat-channels',
  templateUrl: './chat-channels.component.html',
  styleUrls: ['./chat-channels.component.scss']
})
export class ChatChannelsComponent implements OnInit {

  // socket
  socket: Socket;

  constructor(private $socketIoService: SocketIoService, private messages: MessageService) {
    this.$socketIoService.connect();
  }

  ngOnInit(): void {
    if (!this.socket) {
      this.socket = this.$socketIoService.socketIo;
    }
    this.messages.close();
    this.messages.messages.subscribe((msg) => {
      // if (msg.type === 'roomInfo') {
      //   // this.room = msg;
      // }
      console.log('订阅消息', msg);
    });
  }

}
