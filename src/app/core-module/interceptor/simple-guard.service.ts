import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class SimpleGuardService implements CanActivate {
  token: string = localStorage.getItem('token');

  constructor(private router: Router) {
  }

  // 是否允许进入该路由
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // 权限控制逻辑如 是否登录/拥有访问权限
    if (!this.token) {
      this.router.navigateByUrl('login');
    }
    return true;
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

  // 是否可以导航子路由
  /*canActivateChild() {
    // 返回false则导航将失败/取消
    // 也可以写入具体的业务逻辑
    console.log('canActivateChild');
    return true;
  }*/

  // 默认值为true，表明路由是否可以被加载
  /*canLoad(route: Route) {
    // 是否可以加载路由
    console.log('canload');
    return true;
  }*/
}
