import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate, CanActivateChild,
  Router,
  RouterStateSnapshot, UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';

@Injectable()
export class SimpleGuardService implements CanActivate, CanActivateChild {
  token: string;

  constructor(private router: Router, private $message: NzMessageService) {
  }

  // 是否允许进入该路由
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): true | UrlTree {
    const url: string = state.url; // 将要跳转的路径
    // console.log('将要跳转的路径', url);
    return this.checkLogin(url);
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
    const token = localStorage.getItem('token');
    const tokenOut = localStorage.getItem('token_out');
    // 校验已登录并且token未超时
    if (token && new Date().getTime() <= +tokenOut) {
      // 返回true
      return true;
    } else {
      this.$message.warning('登录已过期，请重新登录');
      this.removeLocalStorage();
      // 重定向到登录页面
      return this.router.parseUrl('/login');
    }
  }

  // 删除本地存储
  removeLocalStorage(): void {
    localStorage.removeItem('app_menu');
    localStorage.removeItem('user_info');
    localStorage.removeItem('token');
    localStorage.removeItem('token_out');
    localStorage.removeItem('dialogBoxMessage');
  }
}
