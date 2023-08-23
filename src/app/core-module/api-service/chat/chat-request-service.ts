import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {environment} from '../../../../environments/environment';
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
  queryChatMessage(params: { channelId: string, pageNum: number, pageSize: number }): Observable<Result<ChatMessagesInterface[]>> {
    return this.$http.post<Result<ChatMessagesInterface[]>>(`${environment.API_URL}/queryChatMessage`, params);
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
  uploadAvatar(formData: FormData): Observable<Result<string>> {
    return this.$http.post<Result<string>>(`${environment.API_URL}/uploadChannelAvatar`, formData);
  }

  /**
   * 上传附件
   */
  uploadFile(formData: FormData): Observable<HttpEvent<Result<string>>> {
    return this.$http.post<Result<string>>(`${environment.API_URL}/attachmentsUpload`, formData, {
      reportProgress: true, observe: 'events',
    });
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
  queryChannel(id: string): Observable<Result<CreateChannelParamInterface[]>> {
    return this.$http.get<Result<CreateChannelParamInterface[]>>(`${environment.API_URL}/queryChannel`, {
      params: {id}
    });
  }

  /**
   * 删除频道
   */
  deleteChannel(channelId: string): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/deleteChannel`, {channelId});
  }

  /**
   * 加入频道
   */
  joinChannel(param: { channelId: string, password: string }): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/joinChannel`, param);
  }

  /**
   * 获取文件元数据
   */
  getFileData(path: string): Observable<Blob> {
    return this.$http.get(`https://www.evziyi.top${path}`, {
      // @ts-ignore
      responseType: 'blob'
    });
  }
}
