import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {User} from '../../../shared-module/interface/user';
import {environment} from '../../../../environments/environment';
import {PageParams} from '../../../shared-module/interface/pageParms';

@Injectable()
export class UserManagementRequestService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询用户列表
   */
  getUserList(pageParams: PageParams): Observable<Result<User[]>> {
    return this.$http.post<Result<User[]>>(`${environment.API_URL}/getUserList`, pageParams);
  }

  /**
   * 新增用户
   */
  addUser(userForm): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/users`, userForm);
  }

  /**
   * 删除用户
   */
  deleteUser(id: string): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/deleteUser`, {id});
  }
}
