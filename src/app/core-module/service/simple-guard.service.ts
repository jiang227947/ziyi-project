import {Injectable} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot, ActivationEnd, ActivationStart,
  CanActivate, CanActivateChild, ChildActivationEnd, ChildActivationStart, RouteConfigLoadEnd, RouteConfigLoadStart,
  Router, RouterEvent,
  RouterStateSnapshot, Scroll, UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SessionUtil} from '../../shared-module/util/session-util';

@Injectable()
export class SimpleGuardService implements CanActivate, CanActivateChild {
  token: string;

  constructor(private router: Router, private route: ActivatedRoute, private $message: NzMessageService) {
  }

  // 是否允许进入该路由
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): true | UrlTree {
    const url: string = state.url; // 将要跳转的路径
    // this.router.events.subscribe((evt) => {
    //   if (evt instanceof ActivationStart) {
    //   }
    // });
    // console.log('将要跳转的路径', url);
    if (SessionUtil.menuSimpleGuard(url)) {
      return this.checkLogin(url);
    }
    // 404页面
    this.router.navigateByUrl('/exception');
    return true;
    // 权限控制逻辑如 是否登录/拥有访问权限
    // if (!this.token) {
    //   this.router.navigateByUrl('/login');
    //   return false;
    // }
    // return true;
  }


  // 会在任何子路由被激活之前运行
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // 返回false则导航将失败/取消
    // 也可以写入具体的业务逻辑
    return this.canActivate(next, state);
  }

  // 路由离开的时候进行触发的守卫
  /*canDeactivate(
    component: NewsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) {
    console.log('canDeactivate');
    return true;
  }*/

  // 默认值为true，表明路由是否可以被加载
  /*canLoad(route: Route): boolean {
    // 是否可以加载路由
    console.log('canload', route);
    return true;
  }*/

  // 是否登录
  private checkLogin(url: string): true | UrlTree {
    const token = SessionUtil.getToken();
    const tokenOut = localStorage.getItem('token_out');
    // 校验已登录并且token未超时
    if (token && new Date().getTime() <= +tokenOut) {
      // 返回true
      return true;
    } else {
      this.$message.warning('登录已过期，请重新登录');
      SessionUtil.clearUserLocal();
      // 重定向到登录页面
      return this.router.parseUrl('/login');
    }
  }

}
