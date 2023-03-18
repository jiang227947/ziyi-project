import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {environment} from '../../../../environments/environment';
import {GTPMessageInterface} from '../../../shared-module/interface';

/*
* openai服务
* Created by jzy on 2023/3/18
* */
@Injectable()
export class OpenaiRequestService {
  constructor(private $http: HttpClient) {
  }

  /**
   * completions
   * https://stream.api2d.net/v1/chat/completions
   */
  completions(messagesParam: {
    model: string,
    messages: {
      role: string, // 模型身份
      content: string // 模型返回给你的信息
    }[]
  }): Observable<GTPMessageInterface> {
    return this.$http.post<GTPMessageInterface>(`${environment.API2D_OTHER}/chat/completions`, messagesParam);
  }

  /**
   * 查询余额
   * https://api.api2d.com/user/profile
   */
  getBalance(): Observable<any> {
    return this.$http.post<any>(`https://api.api2d.com/user/profile`, null);
  }
}
