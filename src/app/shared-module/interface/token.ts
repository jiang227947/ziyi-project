export interface Token {
  tokenName: string;           // token名称
  tokenValue: string;      // token值
  isLogin: boolean;                  // 此token是否已经登录
  loginId: string;               // 此token对应的LoginId，未登录时为null
  loginType: string;              // 账号类型标识
  tokenTimeout: number;          // token剩余有效期 (单位: 秒)
  sessionTimeout: number;        // User-Session剩余有效时间 (单位: 秒)
  tokenSessionTimeout: number;        // Token-Session剩余有效时间 (单位: 秒) (-2表示系统中不存在这个缓存)
  tokenActivityTimeout: number;       // token剩余无操作有效时间 (单位: 秒)
  loginDevice: string;   // 登录设备类型
}
