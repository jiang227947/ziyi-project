import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {User} from '../../../shared-module/interface/user';
import {environment} from '../../../../environments/environment';

@Injectable()
export class UserManagementRequestService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询用户列表
   */
  getUserList(): Observable<Result<User[]>> {
    return this.$http.get<Result<User[]>>(`${environment.API_URL}/listUser`);
  }

  /**
   * 新增用户
   */
  addUser(userForm): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/addUser`, userForm);
  }
}
