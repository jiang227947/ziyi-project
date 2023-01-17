import {User} from '../interface/user';
import {Token} from '../interface/token';
import {SimpleGuardService} from '../../core-module/service/simple-guard.service';
import {MenuModel} from '../../core-module/model/menu.model';

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
  static getRoleId(): string {
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
    // 设置超时一天
    localStorage.setItem('token_out', `${new Date().getTime() + (24 * 60 * 60 * 1000)}`);
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
    let isTrue = false;
    const menu: MenuModel[] = JSON.parse(localStorage.getItem('app_menu'));
    menu.forEach((item) => {
      if (url === item.menuHref) {
        isTrue = true;
      }
      if (item.children.length > 0) {
        item.children.forEach((childrenItem) => {
          if (url === childrenItem.menuHref) {
            isTrue = true;
          }
        });
      }
    });
    return isTrue;
  }
}
