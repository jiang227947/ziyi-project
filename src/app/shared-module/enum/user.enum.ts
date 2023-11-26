/**
 * 用户相关枚举
 */
export enum UserRoleEnum {
  // 管理员
  admin = '1001',
  // 普通用户
  general = '1002',
  // Github用户
  github = '2001',
  // qq用户
  qq = '2002',
  // 小程序用户
  mobile = '2003',
}

/**
 * 第三方登录枚举
 */
export enum Oauth2Enum {
  github = 'github',
  qq = 'qq',
}
