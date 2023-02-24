import {Token} from './token';
import {UserRoleEnum} from '../enum/user.enum';

export interface User {
  id: number; // id
  name: string;    // 登录名
  userName: string;    // 用户名
  password: string; // 密码
  role: UserRoleEnum;    // 角色
  roleName: string;    // 角色名称
  lastLoginTime: string;    // 上次登录时间
  saTokenInfo: Token;   // token数据
}
