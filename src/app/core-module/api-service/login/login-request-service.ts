import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {User} from '../../../shared-module/interface/user';
import {environment} from '../../../../environments/environment';
import {LeaveMessage} from '../../../shared-module/interface/leaveMessage';

/*
* 登录接口服务
* Created by jzy on 2023/1/15
* */
@Injectable()
export class LoginRequestService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 登录接口
   */
  login(loginInfo: { name: string, password: number }): Observable<Result<User>> {
    return this.$http.post<Result<User>>(`${environment.API_URL}/login`, loginInfo);
  }

  /**
   *
   * 查询用户
   */
  queryUserById(userId: number): Observable<Result<User>> {
    return this.$http.get<Result<User>>(`${environment.API_URL}/queryUserById/${userId}`);
  }

  /**
   *
   * 退出登录
   */
  logout(userId: number): Observable<Result<User>> {
    return this.$http.post<Result<User>>(`${environment.API_URL}/loginOut`, {id: userId});
  }

  /**
   * 添加留言
   */
  addLeaveMessage(body: { name: string, message: string, browser: string }): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.NODE_API_URL}/api/addLeaveMessage`, body);
  }

  /**
   * 查询留言
   */
  getLeaveMessage(): Observable<Result<LeaveMessage[]>> {
    return this.$http.get<Result<LeaveMessage[]>>(`${environment.NODE_API_URL}/api/getLeaveMessage`);
  }
}
