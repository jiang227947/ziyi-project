/**
 * 分页参数
 */
export class PageParams {
  // 页码
  pageNum: number;
  // 一页数据的数量
  pageSize: number;

  constructor(pageNum?: number, pageSize?: number) {
    // 默认第一页
    this.pageNum = pageNum || 0;
    // 默认一页十条数据
    this.pageSize = pageSize || 10;
  }
}
