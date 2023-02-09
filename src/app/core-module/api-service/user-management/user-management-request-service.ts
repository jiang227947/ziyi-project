import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {User} from '../../../shared-module/interface/user';
import {environment} from '../../../../environments/environment';
import {PageParams} from '../../../shared-module/interface/pageParms';
import {File} from '../../../shared-module/interface/file';

@Injectable()
export class UserManagementRequestService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询用户列表
   */
  getUserList(pageParams: PageParams): Observable<Result<User[]>> {
    return this.$http.post<Result<User[]>>(`${environment.API_URL}/listUser`, pageParams);
  }

  /**
   * 新增用户
   */
  addUser(userForm): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/addUser`, userForm);
  }

  /**
   * 删除用户
   */
  deleteUser(id: number): Observable<Result<void>> {
    return this.$http.get<Result<void>>(`${environment.API_URL}/deleteUser/${id}`);
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
    return this.$http.post<Result<any>>(`${environment.API_URL}/deleteFile/${id}`, null);
  }
}
