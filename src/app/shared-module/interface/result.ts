export interface Result<T> {
  // 状态码
  code: number;
  // 提示
  msg: string;
  // 信息
  data: T;
}
