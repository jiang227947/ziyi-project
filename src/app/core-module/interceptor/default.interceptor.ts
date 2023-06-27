import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler, HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponseBase,
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {Token} from '../../shared-module/interface/token';
import {NzMessageService} from 'ng-zorro-antd/message';
import {User} from '../../shared-module/interface/user';
import {SessionUtil} from '../../shared-module/util/session-util';

const CODEMESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  cookie: string = '';

  constructor(private injector: Injector, private $router: Router, private $message: NzMessageService) {
  }

  checkStatus(ev: HttpResponseBase): any {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
      return;
    }
    let message: string;
    if (ev instanceof HttpErrorResponse) {
      const error = (ev as HttpErrorResponse).error;
      if (error && error.message) {
        message = error.message;
      } else {
        message = (ev as HttpErrorResponse).message;
      }
    }
    // const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    // this.notification.error(`请求错误 ${ev.status}: ${ev.url}`, errortext);
  }

  private handleData(ev: HttpResponseBase): Observable<any> {
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    // this.checkStatus(ev);
    // 业务处理：一些通用操作
    switch (ev.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用
        // if (event instanceof HttpResponse) {
        //     const body: any = event.body;
        //     if (body && body.status !== 0) {
        //         this.msg.error(body.msg);
        //         // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
        //         // this.http.get('/').subscribe() 并不会触发
        //         return throwError({});
        //     } else {
        //         // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
        //         return of(new HttpResponse(Object.assign(event, { body: body.response })));
        //         // 或者依然保持完整的格式
        //         return of(event);
        //     }
        // }
        break;
      case 401:
        SessionUtil.clearUserLocal();
        this.$message.error('登录已过期！');
        this.$router.navigate(['/login']);
        break;
      case 403:
        break;
      case 404:
        this.$message.error('请求无效！');
        this.goToRouter(`**/exception/${ev.status}`);
        break;
      case 500:
        this.$message.error('服务异常，请稍后重试！');
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          this.$message.error(`状态码${ev.status}，未知错误，大部分是由于后端不支持CORS或无效配置引起！`);
          return throwError(ev);
        }
        break;
    }
    return of(ev);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    const url = req.url;
    let headers = new HttpHeaders();
    const token: Token = SessionUtil.getToken();
    const userInfo: User = SessionUtil.getUserInfo();
    /**
     * headers添加skip字段则认为是不需要校验的请求
     */
      // 请求跳过白名单
    const skipIntercept = req.headers.has('skip');
    if (skipIntercept) {
      // 删除跳过请求头
      req = req.clone({
        headers: req.headers.delete('skip')
      });
    }
    if (!token && !skipIntercept) {
      this.$router.navigate(['/login']);
    }
    /**
     * 请求添加header信息
     */
    if (url.includes('evziyi.top') || url.includes('http://localhost:3001')) {
      // 添加token信息
      if (userInfo) {
        headers = headers.append('userId', `${userInfo.id}`);
      }
      // 添加用户id
      if (token) {
        headers = headers.append(token.tokenName, `Bearer ${token.tokenValue}`);
      }
    }
    // 统一添加国际化的头部处理    并携带WEB标识
    // let newHeaders = req.headers.append('Accept-Language', this.i18n.currentLang);
    // if (!newHeaders.get(AppSecurity.APP_HTTP_HEADERS.TERMINAL)) {
    //     newHeaders = req.headers.append(AppSecurity.APP_HTTP_HEADERS.TERMINAL, 'WEB');
    // }
    // const newReq = req.clone({ url });
    // const newReq = req.clone({ url, headers: newHeaders });
    // return next.handle(newReq).pipe(
    //     mergeMap((event: any) => {
    //         // 允许统一对请求错误处理
    //         if (event instanceof HttpResponseBase) return this.handleData(event);
    //         // 若一切都正常，则后续操作
    //         return of(event);
    //     }),
    //     catchError((err: HttpErrorResponse) => this.handleData(err)),
    // );
    // 设置url和headers
    const cloneReq = req.clone({url, headers});
    return next.handle(cloneReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponseBase) {
          return this.handleData(event);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }

  doIntercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        switch ((err as HttpErrorResponse).status) {
          case 401:
            SessionUtil.clearUserLocal();
            this.$message.error('登录已过期！');
            this.$router.navigate(['/login']);
            break;
          case 403:
            break;
          case 404:
            this.$message.error('请求无效！');
            break;
          case 500:
            this.$message.error('服务异常，请稍后重试！');
            break;
        }
      }
      return throwError(err);
    }));
  }

  goToRouter(url: string): void {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }
}
