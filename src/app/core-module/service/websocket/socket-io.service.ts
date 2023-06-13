import {Injectable} from '@angular/core';
import {io} from 'socket.io-client';
import {environment} from '../../../../environments/environment';
import {Socket} from 'socket.io-client/build/esm/socket';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {
  ChatChannelsMessageTypeEnum
} from '../../../shared-module/enum/chat-channels.enum';
import {
  ChatChannelSubscribeInterface,
  ChatMessagesInterface,
} from '../../../shared-module/interface/chat-channels';
import {MessageService} from '../../../shared-module/service/Message.service';

/**
 * Websocket服务
 * 使用socket.io
 * https://socket.io/zh-CN/docs/v4/client-api/#ioprotocol
 */
@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  socketIo: Socket;

  constructor(private messages: MessageService) {
  }

  /**
   * 连接
   */
  public connect(): void {
    const opt = {
      // path: '/socket.io',
      extraHeaders: {
        role: SessionUtil.getRoleId(),
        token: SessionUtil.getToken().tokenValue
      }
    };
    if (environment.production) {
      // 部署服务器地址
      this.socketIo = io(`wss://www.evziyi.top`, opt);
    } else {
      this.socketIo = io(`ws://127.0.0.1:3011/`, opt);
      // this.socketIo = io(`wss://www.evziyi.top`, opt);
    }
    // 连接成功
    this.socketIo.on('connect', () => {
      // todo 需要让服务器保存新进来的用户资料
      // console.log('socket.recovered', this.socketIo.recovered);
      // 是否为紧急重连
      if (this.socketIo.recovered) {
        // any missed packets will be received
      } else {
        // new or unrecoverable session
      }
      console.log('websocket 连接成功', this.socketIo.id);
      // this.socketIo.send('ping');
      // 开启心跳检测
      // this.heartCheckStart();
      // this.reconnectCount = RECONNECT_COUNT;
      // this.socketIo.emit('onmessage', this.socketIo.id);
      // 公共频道消息
      this.socketIo.on(ChatChannelsMessageTypeEnum.publicMessage, (msg: ChatMessagesInterface) => {
        // console.log('公共频道消息', msg);
        const message: ChatChannelSubscribeInterface = {
          type: ChatChannelsMessageTypeEnum.publicMessage,
          msg
        };
        this.messages.sendMessage(message);
      });
      // 房间消息
      this.socketIo.on(ChatChannelsMessageTypeEnum.roomMessage, (msg: ChatMessagesInterface) => {
        // console.log('房间消息', msg);
        const message: ChatChannelSubscribeInterface = {
          type: ChatChannelsMessageTypeEnum.roomMessage,
          msg
        };
        this.messages.sendMessage(message);
      });
      // 系统消息
      this.socketIo.on(ChatChannelsMessageTypeEnum.systemMessage, (msg) => {
        // console.log('系统消息', msg);
        const message: ChatChannelSubscribeInterface = {
          type: ChatChannelsMessageTypeEnum.systemMessage,
          msg
        };
        this.messages.sendMessage(message);
      });
      // 全体消息
      this.socketIo.on(ChatChannelsMessageTypeEnum.allMessage, (msg) => {
        // console.log('全体消息', msg);
        const message: ChatChannelSubscribeInterface = {
          type: ChatChannelsMessageTypeEnum.allMessage,
          msg
        };
        this.messages.sendMessage(message);
      });
      // 连接断开
      this.socketIo.on('disconnect', (reason) => {
        console.log('websocket 连接断开: ', reason);
        if (reason === 'io server disconnect') {
          // 如果是服务器断开则重连
          this.socketIo.connect();
        }
        // 重新连接
        /*let reconnectCount: number = 5;
        const reconnectTimer = setTimeout(() => {
          console.log('重连剩余次数' + reconnectCount);
          if (reconnectCount === 0) {
            return;
          }
          reconnectCount--;
          this.connect(reconnectTimer);
        }, 5000);*/
      });
      // 连接关闭
      this.socketIo.on('close', (msg) => {
        // todo 需要处理断开的用户
        console.log('websocket 连接关闭');
        this.close();
      });
      // 连接错误
      this.socketIo.on('connect_error', (msg) => {
        // todo 需要处理断开的用户
        console.log('websocket 连接错误');
        this.close();
      });
    });
  }

  /**
   * 关闭
   */
  public close(): void {
    if (this.socketIo) {
      this.socketIo.close();
      this.socketIo = null;
    }
    // 关闭订阅
    this.messages.close();
  }
}
