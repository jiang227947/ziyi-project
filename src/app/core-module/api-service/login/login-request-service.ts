import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../../../shared-module/interface/result';
import {User} from '../../../shared-module/interface/user';
import {environment} from '../../../../environments/environment';
import {LeaveMessage} from '../../../shared-module/interface/leaveMessage';
import {Visitor} from '../../../shared-module/interface/visitor';

/*
* 登录接口服务
* Created by jzy on 2023/1/15
* */
@Injectable()
export class LoginRequestService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 注册接口
   */
  register(loginInfo: { name: string, userName: string, password: string, email: string, code: number }): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/register`, loginInfo, {
      headers: {
        skip: 'true'
      }
    });
  }

  /**
   * 发送邮件验证码
   */
  sendEmail(email: string): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/sendEmail`, {email}, {
      headers: {
        skip: 'true'
      }
    });
  }

  /**
   * 登录接口
   */
  login(loginInfo: { name: string, password: string }): Observable<Result<User>> {
    return this.$http.post<Result<User>>(`${environment.API_URL}/login`, loginInfo, {
      headers: {
        skip: 'true'
      }
    });
  }

  /**
   * 后台获取uuid
   */
  gitUuidState(random: string): Observable<Result<string>> {
    return this.$http.get<Result<string>>(`${environment.API_URL}/gitUuidState`, {
      params: {
        random
      },
      headers: {
        skip: 'true'
      }
    });
  }

  /**
   * github登录跳转地址
   */
  githubLogin(): string {
    return `https://github.com/login/oauth/authorize?client_id=c18cfa87805929090ede&scope=user:email`;
  }

  /**
   * qq登录跳转地址
   */
  qqLogin(result: { aesString: string, client_id: number }): string {
    const redirectUrl = encodeURIComponent('https://www.evziyi.top/api/qqAuth-callback');
    return `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${result.client_id}&redirect_uri=${redirectUrl}&state=${result.aesString}`;
  }

  /**
   * 查询用户
   */
  queryUserById(userId: number): Observable<Result<User>> {
    return this.$http.get<Result<User>>(`${environment.API_URL}/queryUserById`, {
      params: {
        id: userId
      }
    });
  }

  /**
   * 退出登录
   */
  logout(userId: number): Observable<Result<User>> {
    return this.$http.post<Result<User>>(`${environment.API_URL}/loginOut`, {id: userId});
  }

  /**
   * 添加留言
   */
  addLeaveMessage(body: { name: string, message: string, browser: string }): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/addLeaveMessage`, body);
  }

  /**
   * 查询留言
   */
  getLeaveMessage(): Observable<Result<LeaveMessage[]>> {
    return this.$http.get<Result<LeaveMessage[]>>(`${environment.API_URL}/getLeaveMessage`);
  }

  /**
   * 获取访客数据
   */
  getVisitor(): Observable<Visitor> {
    return this.$http.get<Visitor>(`https://ipinfo.io/?token=5be098be56e294`, {
      headers: {
        skip: 'true'
      }
    });
  }

  /**
   * 保存访客
   */
  saveVisitor(visitorData: Visitor): Observable<Result<void>> {
    return this.$http.post<Result<void>>(`${environment.API_URL}/visitor`, visitorData, {
      headers: {
        skip: 'true'
      }
    });
  }
}
