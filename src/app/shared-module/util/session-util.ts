import {User} from '../interface/user';
import {Token} from '../interface/token';
import {SimpleGuardService} from '../../core-module/service/simple-guard.service';
import {MenuModel} from '../../core-module/model/menu.model';
import {AppMenuService} from '../service/app-menu.service';
import {UserRoleEnum} from '../enum/user.enum';

/**
 * session工具类
 */
export class SessionUtil {
  /**
   * 获取用户信息
   */
  static getUserInfo(): User {
    if (localStorage.getItem('user_info') && localStorage.getItem('user_info') !== 'undefined') {
      return JSON.parse(localStorage.getItem('user_info'));
    } else {
      return undefined;
    }
  }

  /**
   * 获取用户ID
   */
  static getUserId(): number {
    const userInfo = this.getUserInfo();
    return userInfo.id;
  }

  /**
   * 获取权限ID
   */
  static getRoleId(): UserRoleEnum {
    const userInfo = this.getUserInfo();
    if (userInfo.role) {
      return userInfo.role;
    } else {
      return undefined;
    }
  }

  /**
   * 获取用户名称
   */
  static getUserName(): string {
    const userInfo = this.getUserInfo();
    if (userInfo.name) {
      return userInfo.name;
    } else {
      return '';
    }
  }

  /**
   * 设置菜单
   */
  static setMenuList(): Promise<void> {
    return new Promise<void>(resolve => {
      // 菜单
      const menuList = AppMenuService.getAppMenu();
      const userRoleId = this.getRoleId();
      for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].menuRole) {
          // 判断是否有这个菜单权限
          if (menuList[i].menuRole.indexOf(userRoleId) === -1) {
            // 删除
            menuList.splice(i, 1);
          }
        }
      }
      localStorage.setItem('app_menu', JSON.stringify(menuList));
      // 隐藏菜单
      const hiddenMenuList = AppMenuService.hiddenMenu();
      for (let i = 0; i < hiddenMenuList.length; i++) {
        if (hiddenMenuList[i].menuRole) {
          // 判断是否有这个菜单权限
          if (hiddenMenuList[i].menuRole.indexOf(userRoleId) === -1) {
            // 删除
            hiddenMenuList.splice(i, 1);
          }
        }
      }
      localStorage.setItem('hidden_menu', JSON.stringify(hiddenMenuList));
      resolve();
    });
  }

  /**
   * 获取菜单
   */
  static getMenuList(): MenuModel[] {
    return JSON.parse(localStorage.getItem('app_menu'));
  }

  /**
   * 获取token信息
   */
  static getToken(): Token {
    return JSON.parse(localStorage.getItem('token'));
  }

  /**
   * 设置token
   * param value
   * param time
   */
  static setToken(value: Token): void {
    localStorage.setItem('token', JSON.stringify(value));
    // 设置超时6小时
    localStorage.setItem('token_out', `${new Date().getTime() + value.tokenTimeout}`);
  }

  /**
   * 获取token是否超时
   */
  static getTokenOut(): boolean {
    const tokenOut: string = localStorage.getItem('token_out');
    // 判断时间是否超过24小时
    return new Date().getTime() < new Date(+tokenOut).getTime();
  }

  /**
   * 清除用户信息
   */
  static clearUserLocal(): void {
    localStorage.removeItem('app_menu');
    localStorage.removeItem('user_info');
    localStorage.removeItem('token');
    localStorage.removeItem('token_out');
    localStorage.removeItem('dialogBoxMessage');
  }

  /**
   * 判断是否有这个路由
   */
  static menuSimpleGuard(url: string): boolean {
    let isTrue: boolean = false;
    const menu: MenuModel[] = JSON.parse(localStorage.getItem('app_menu'));
    const hiddenMenu: MenuModel[] = JSON.parse(localStorage.getItem('hidden_menu'));
    if (menu) {
      for (let i = 0; i < menu.length; i++) {
        const item: MenuModel = menu[i];
        if (url === item.menuHref || url.includes(item.menuHref)) {
          isTrue = true;
        }
        if (item.children.length > 0) {
          for (let o = 0; o < item.children.length; o++) {
            if (url === item.children[o].menuHref) {
              isTrue = true;
            }
          }
        }
      }
    }
    if (hiddenMenu) {
      for (let i = 0; i < hiddenMenu.length; i++) {
        const item: MenuModel = hiddenMenu[i];
        if (url === item.menuHref || url.includes(item.menuHref)) {
          isTrue = true;
        }
        if (item.children.length > 0) {
          for (let o = 0; o < item.children.length; o++) {
            if (url === item.children[o].menuHref) {
              isTrue = true;
            }
          }
        }
      }
    }
    return isTrue;
  }
}
