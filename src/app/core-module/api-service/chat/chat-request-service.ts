import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {environment} from '../../../../environments/environment';
import {PageParams} from '../../../shared-module/interface/pageParms';
import {ChatMessagesInterface, CreateChannelParamInterface} from '../../../shared-module/interface/chat-channels';

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
  queryChatMessage(pageParams: PageParams): Observable<Result<ChatMessagesInterface[]>> {
    return this.$http.post<Result<ChatMessagesInterface[]>>(`${environment.API_URL}/queryChatMessage`, pageParams);
  }

  /**
   * 添加反应表情
   */
  addReaction(param: { emoji: string, id: number, userId: number }): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/addReaction`, param);
  }

  /**
   * 上传头像
   */
  uploadChannelAvatar(formData: FormData): Observable<Result<string>> {
    return this.$http.post<Result<string>>(`${environment.API_URL}/uploadChannelAvatar`, formData);
  }

  /**
   * 创建频道
   */
  createChannel(param: CreateChannelParamInterface): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/createChannel`, param);
  }

  /**
   * 查询频道
   */
  queryChannel(id: number): Observable<Result<CreateChannelParamInterface[]>> {
    return this.$http.get<Result<CreateChannelParamInterface[]>>(`${environment.API_URL}/queryChannel`, {
      params: {id}
    });
  }
}
