export interface Result<T> {
  // 状态码
  code: number;
  // 提示
  msg: string;
  /**
   * 返回的数据 T 可能是数组、对象
   */
  data?: T;
  /**
   * 如果是列表 返回有分页页码
   */
  pageNum?: number;
  /**
   * 如果是列表 返回有分页每页条数
   */
  pageSize?: number;
  /**
   * 如果是列表 返回有分页总页数
   */
  totalCount?: number;
  /**
   * 如果是列表 返回有分页总条数
   */
  totalPage?: number;
}
