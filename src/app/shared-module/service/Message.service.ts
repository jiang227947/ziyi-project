import {Observable, Subject} from 'rxjs';
/**
 * 订阅流
 */
export class MessageService {
  private _messages = new Subject<any>();
  private messages$: Observable<any> = this._messages.asObservable();

  // 返回订阅
  get messages(): Observable<any> {
    return this.messages$;
  }

  // 发射消息
  sendMessage(message: any): void {
    console.log('发射消息', message);
    this._messages.next(message);
  }

  // 关闭订阅
  close(): void {
    // this._messages.next();
    // this._messages.complete();
  }
}
