import {Observable, Subject} from 'rxjs';

/**
 * 订阅流
 */
export class MessageService {
  private _messages = new Subject<any>();

  get messages(): Observable<any> {
    return this._messages.asObservable();
  }

  // 发射消息
  sendMessage(message: any): void {
    this._messages.next(message);
  }

  // 关闭订阅
  close(): void {
    this._messages.complete();
  }
}
