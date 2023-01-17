import {PageParams} from '../../interface/pageParms';
import {TableConfigModel} from '../../model/table-config.model';

export class TableBasic {
  // 表格通用配置
  _dataSet = [];
  // 表格通用分页配置
  pageBean: PageParams = new PageParams(10, 1);
  tableConfig: TableConfigModel;

  constructor() {
  }

  /**
   * 初始化表格配置
   */
  initTableConfig(): void {
  }

  /**
   * 数据获取
   */
  refreshData(): void {
  }

  /**
   * 监听页面切换
   * param event
   */
  pageChange(event): void {
    this.refreshData();
  }

  /**
   * 手动查询
   * param event
   */
  handleSearch(event): void {
    this.setPageCondition(event);
    this.refreshData();
  }

  /**
   * 设置查询条件
   */
  setPageCondition(event): void {
    // this.pageBean = new PageModel(this.pageBean.pageSize, 1, 0);
    this.pageBean.pageNum = 1;
    // this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 删除等操作后查询条件修改
   */
  resetPageCondition(): void {
    this.pageBean.pageNum = 1;
  }

  /**
   * 排序
   * param event
   */
  handleSort(event): void {
    console.log(event);
    this.refreshData();
  }

  /**
   * 导出
   * param event
   */
  handleExport(event): void {
    console.log(event);
  }

  /**
   * 打印
   * param event
   */
  handlePrint(event): void {
    console.log(event);
  }
}
