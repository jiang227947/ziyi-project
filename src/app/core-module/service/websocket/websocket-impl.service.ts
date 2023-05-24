import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {Observable, Subject} from 'rxjs';

declare var WEBSOCKET_PROTOCOL;
const RECONNECT_COUNT = 4;

/**
 * Websocket服务
 */
@Injectable()
export class WebsocketImplService {
  // 通过订阅的方式拿到消息
  subscibeMessage: Observable<any>;
  // 重连次数
  private reconnectCount = RECONNECT_COUNT;
  socket: WebSocket;
  // 心跳检测时间 默认半分钟发起一次心跳检测
  private heartCheckTime = 30000;
  // 心跳定时器
  private heartCheckTimer;
  // 关闭定时器
  private closeTimer;
  // 消息订阅流
  private messageTopic;
  // 重连锁
  private lockReconnect: boolean = false;
  // 重连定期器
  private reconnectTimer;
  // 无限重连模式、开启后在断网后会反复重连
  private infiniteReconnection: boolean = true;

  constructor() {

  }

  /**
   * 连接
   */
  public connect(): void {
    this.lockReconnect = false;
    if (!this.messageTopic) {
      this.messageTopic = new Subject<any>();
      this.subscibeMessage = this.messageTopic.asObservable();
    }
    if (environment.production) {
      // 部署服务器地址
      // this.socket = new WebSocket(`${WEBSOCKET_PROTOCOL}://${location.host}/websocket/${SessionUtil.getToken()}`);
      this.socket = new WebSocket(`ws://127.0.0.1:3011/`);
    } else {
      // this.socket = new WebSocket(`ws://localhost:4200/websocket/${SessionUtil.getToken()}`);
      this.socket = new WebSocket(`ws://127.0.0.1:3011/websocket`);
      // this.socket = new WebSocket(`${WEBSOCKET_PROTOCOL}://${location.host}/websocket/${SessionUtil.getToken()}`);
    }
    // 连接成功
    this.socket.onopen = () => {
      console.log('websocket 连接成功');
      // 开启心跳检测
      this.heartCheckStart();
      this.reconnectCount = RECONNECT_COUNT;
    };
    this.socket.onmessage = (event) => {
      // this.heartCheckStart();
      if (event.data === 'alive') {
        console.log('websocket has alive');
      } else {
        this.messageTopic.next(event);
        this.messageTopic.complete();
      }
    };
    this.socket.onclose = () => {
      console.log('连接关闭');
      // this.reconnect();
    };
    this.socket.onerror = () => {
      console.log('连接失败, 发生异常了');
      // this.reconnect();
    };
  }

  /**
   * 关闭
   */
  public close(): void {
    if (this.socket) {
      this.clearTimer(this.heartCheckTimer);
      this.clearTimer(this.closeTimer);
      this.clearTimer(this.reconnectTimer);
      this.socket.close();
      if (this.messageTopic) {
        this.messageTopic.next();
        this.messageTopic.complete();
      }
      /**
       this.messageTopic.next();
       this.messageTopic.complete();
       */
      this.messageTopic = null;
      this.lockReconnect = true;
      this.reconnectCount = 0;
    }
  }

  /**
   * 获取数据（可能存在隐患）
   * 建议适用订阅的方式获取数据
   * param {(event) => {}} fn
   */
  public getMessage(fn: (event) => {}): void {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        if (fn) {
          fn(event);
        }
      };
    }
  }

  /**
   * 重新连接
   */
  private reconnect(): void {
    if (this.lockReconnect) {
      return;
    }
    this.lockReconnect = true;
    this.clearTimer(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.infiniteReconnection) {
        console.log('websocket重连中.....');
        this.connect();
        return;
      }
      console.log('重连剩余次数' + this.reconnectCount);
      if (this.reconnectCount === 0) {
        return;
      }
      this.reconnectCount--;
      this.connect();
    }, 5000);
  }

  /**
   * 清空定时器
   * param timer
   */
  private clearTimer(timer: number): void {
    if (timer) {
      clearTimeout(timer);
      // timer = null;
    }
  }

  /**
   * 心跳开始
   */
  heartCheckStart(): void {
    this.clearTimer(this.heartCheckTimer);
    this.clearTimer(this.closeTimer);
    this.heartCheckTimer = setTimeout(() => {
      this.socket.send('ping');
      console.log('正在ping服务器.....');
      // this.closeTimer = setTimeout(() => {
      //   console.log('关闭服务');
      //   this.socket.close();
      // }, 5000);
    }, this.heartCheckTime);

  }
}
