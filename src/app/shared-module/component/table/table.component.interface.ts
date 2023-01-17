import {ColumnConfig, Operation} from '../../model/table-config.model';

/**
 * Created by xiaoconghu on 2018/12/12.
 */
export interface TableComponentInterface {
  /**
   * 刷新表格行选择状态
   */
  refreshCheckStatus(status?: boolean, data?): void;

  /**
   * 点击全选或者全去选按钮
   * param {boolean} value
   */
  checkAll(value: boolean): void;

  /**
   * 翻页处理函数
   * param e
   */
  refreshStatus(e);

  /**
   * 翻页size变化处理
   * param pageSize
   */
  pageSizeChange(pageSize: number): void;

  /**
   * 操作列处理函数
   * param {Operation} operation
   * param index
   * param data
   */
  handle(operation: Operation, index, data, key): void;

  /**
   * 头部按钮处理函数，左下处理函数
   * param {Operation} operation
   * param index
   */
  topHandle(operation: Operation);

  /**
   * 排序处理函数
   * param event
   */
  sort(event, key): void;

  /**
   * 拖拽列宽鼠标移动处理函数
   * param event
   * param {ColumnConfig} column
   */
  handleMouseMove(event, column: ColumnConfig);

  /**
   * 拖拽列宽鼠标按下处理函数
   * param event
   * param column
   */
  handleMouseDown(event, column);

  /**
   * 拖拽列宽鼠标弹起处理函数
   * param event
   * param column
   */
  handleMouseOut(event, column);

  /**
   * 搜索处理函数
   * param e
   */
  handleSearch();

  /**
   * 日期改变处理函数
   * param e
   */
  onChange(event, key);

  /**
   * 时间范围改变处理函数
   * param {any[]} event
   * param key
   */
  rangValueChange(data: { key: string, value: any[] });

  /**
   * 重至处理函数
   */
  handleRest();

  /**
   * 获取已经选中的节点
   * returns {any[]}
   */
  getDataChecked(): any[];

  /**
   * 打开表格搜索事件
   */
  openTableSearch(): void;

  /**
   * 收集已选id
   */
  collectSelectedId(checked: boolean, item: any): void;

  /**
   * 更新选中数据
   */
  updateSelectedData(): void;

  /**
   * 切换隐藏操作栏
   */
  toggleHiddenOperateColumn(hidden?: boolean): void;

  /**
   * 行点击事件
   * param data
   */
  rowClick(data: any): void;
}
