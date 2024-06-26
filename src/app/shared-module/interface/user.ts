import {Token} from './token';
import {UserRoleEnum} from '../enum/user.enum';

export interface User {
  id: string; // id
  name: string;    // 登录名
  userName: string;    // 用户名
  email: string;    // 邮箱
  password: string; // 密码
  avatar: string;    // 头像路径
  remarks: string;    // 备注
  role?: UserRoleEnum;    // 角色
  roleName?: string;    // 角色名称
  lastLoginTime?: string;    // 上次登录时间
  token?: Token;   // token数据
  saTokenInfo?: Token;   // token数据
  created?: string;   // 创建时间
  username?: string;    // 用户名
}

/**
 * 第三方登录返回数据接口
 */
export interface OauthInterface {
  login_type: string; // 类型
  date: number; // 时间
  userInfo: User; // 用户信息
  state?: any; // 前端传递的参数，防止CSRF攻击，成功授权后回调时会原样带回
}
