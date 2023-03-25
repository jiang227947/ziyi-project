import {PageParams} from '../../../shared-module/interface/pageParms';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {File} from '../../../shared-module/interface/file';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ResourceManagementRequestService {

  constructor(private $http: HttpClient) {
  }

  /**
   * 查询文件列表
   */
  queryImageList(pageParams: PageParams): Observable<Result<File[]>> {
    return this.$http.post<Result<File[]>>(`${environment.API_URL}/queryFileList`, pageParams);
  }

  /**
   * 上传文件
   */
  uploadFile(formData: FormData): Observable<HttpEvent<Result<any>>> {
    return this.$http.post<Result<any>>(`${environment.API_URL}/uploadFile`, formData, {
      reportProgress: true, observe: 'events',
    });
  }

  /**
   * 删除文件
   */
  deleteFile(id: number): Observable<Result<any>> {
    return this.$http.post<Result<any>>(`${environment.API_URL}/deleteFile`, {id});
  }
}
