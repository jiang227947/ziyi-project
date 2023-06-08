import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {environment} from '../../../../environments/environment';
import {PageParams} from '../../../shared-module/interface/pageParms';
import {QueryMessagesList} from '../../../shared-module/interface/chat-channels';

/**
 * 聊天接口服务
 */
@Injectable()
export class ChatRequestService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询聊天记录
   */
  queryChatMessage(pageParams: PageParams): Observable<Result<QueryMessagesList>> {
    return this.$http.post<Result<QueryMessagesList>>(`${environment.API_URL}/queryChatMessage`, pageParams);
  }
}
