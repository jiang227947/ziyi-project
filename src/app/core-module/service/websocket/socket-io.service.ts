import {Injectable} from '@angular/core';
import {io} from 'socket.io-client';
import {environment} from '../../../../environments/environment';
import {Socket} from 'socket.io-client/build/esm/socket';

/**
 * Websocket服务
 * 使用socket.io
 * https://socket.io/zh-CN/docs/v4/client-api/#ioprotocol
 */
@Injectable({providedIn: 'root'})
export class SocketIoService {
  public socketIo: Socket;

  constructor() {
  }

  /**
   * 连接
   */
  public connect(): void {
    if (environment.production) {
      // 部署服务器地址
      this.socketIo = io(`ws://127.0.0.1:3011/`);
    } else {
      this.socketIo = io(`ws://127.0.0.1:3011/`);
    }
    // 连接成功
    this.socketIo.on('connect', () => {
      console.log('websocket 连接成功', this.socketIo.id);
      // this.socketIo.send('ping');
      // 开启心跳检测
      // this.heartCheckStart();
      // this.reconnectCount = RECONNECT_COUNT;
      // this.socketIo.emit('onmessage', this.socketIo.id);
      // 对话消息
      this.socketIo.on('chat_message', (msg) => {
        console.log('对话消息', msg);
      });
      this.socketIo.on('onmessage', (msg) => {
        // this.heartCheckStart();
        // if (msg.data === 'alive') {
        //   console.log('websocket has alive');
        // } else {
        //   this.messageTopic.next(event);
        // }
        console.log('接受单独消息', msg);
      });
      // 接受广播消息
      this.socketIo.on('onallmessage', (msg) => {
        console.log('接受广播消息', msg);
      });
      // 连接断开
      this.socketIo.on('disconnect', (reason) => {
        console.log('websocket 连接断开');
      });
      // 连接关闭
      this.socketIo.on('close', (msg) => {
        console.log('websocket 连接关闭');
        // this.reconnect();
      });
      // 连接错误
      this.socketIo.on('connect_error', (msg) => {
        console.log('websocket 连接错误');
        // this.reconnect();
      });
    });
  }


  /**
   * 关闭
   */
  public close(): void {
    if (this.socketIo) {
      this.socketIo.close();
    }
  }
}
