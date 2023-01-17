import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ColumnConfig, Operation, TableConfigModel} from '../../model/table-config.model';
import {NzTableSortConfig, TableSortConfig, TableStyleConfigEnum} from '../../enum/table-style-config.enum';
import {TableStylePixelEnum} from '../../enum/table-style-pixel.enum';
import {TableComponentInterface} from './table.component.interface';
import {FilterCondition, SortCondition} from '../../model/query-condition.model';
import {TableService} from './table.service';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {SystemForCommonService} from '../../../core-module/api-service/system-setting';
import {ResultModel} from '../../model/result.model';
import {TreeNodeModel} from '../../model/tree-node.model';
import {TableQueryTermStoreService} from '../../../core-module/store/table-query-term.store.service';
import {PageParams} from '../../interface/pageParms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CommonUtil} from '../../util/commonUtil';

declare var $: any;

/**
 * 表格组件
 */
@Component({
  selector: 'xc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableService],
})
export class TableComponent implements OnInit, OnChanges, TableComponentInterface, OnDestroy, AfterViewInit {
  // 全选按钮全选时为全选当前页还是所有页，true所有页/false仅全选当前页
  @Input() isCheckAll = false;
  // 数据集合
  @Input() dataSet = [];
  // 传入的选中数据
  @Input() selectedData: any[] = [];
  // 分页实体
  @Input() pageBean: PageParams = new PageParams();
  // 列表配置
  @Input() tableConfig: TableConfigModel = new TableConfigModel();
  // 大数据时显示的总条数 （非分页控件的总条数）
  @Input() totalCount = 0;
  // esPagination 分页是否显示总条数
  @Input() esPaginationCount = false;
  // 分页变化
  @Output() pageChange = new EventEmitter<PageParams>();
  // 当全选按钮是全选所有页时， 点击全选按钮的事件
  @Output() checkAllClickEvent = new EventEmitter<boolean>();
  // 导出模板
  @ViewChild('exportTemp') exportTemp: TemplateRef<any>;
  // 语言包
  public language: any = {table: {}, form: {}, common: {}};
  // 所有选中
  public allChecked = false;
  // 半选状态
  public indeterminate = false;
  // 所有不选中
  public allUnChecked = true;
  // 设置列配置项
  public configurableColumn: ColumnConfig[] = [];
  // 下拉选择项
  public listOfSelection: any[] = [];
  // 是否开始拖拽
  public dragging: boolean;
  // 拖拽线显示
  public resizeProxyShow: boolean;
  // 拖拽状态
  public dragState: { startMouseLeft: any; startLeft: number; startColumnLeft: number; tableLeft: number };
  // 当前拖拽的列
  public draggingColumn: ColumnConfig;
  // 查询条件
  public queryTerm: Map<string, FilterCondition> = new Map<string, FilterCondition>();
  // 日期搜索
  public searchDate = {};
  // 范围日期搜索
  public rangDateValue = {};
  // 导出选择项值
  public exportRadioValue;
  // 拖拽线id
  public resizeProxyId = '';
  // 列表id
  public tableId = '';
  // 打印了tooltip隐藏
  public printVisible: boolean;
  // 列设置
  public columnSetting: any;
  // 列设置隐藏显示
  public setColumnVisible: boolean;
  // 列设置数据
  public columnSettings: any[];
  // 导出参数
  public exportQueryTerm: any;
  // 已选数据set
  public keepSelectedData = new Map<string, any>();
  // 为了解决第一次进入表格 有nz-switch产生的动画
  public showPagination = false;
  public isFireFox = false;
  public currentShowColumns: ColumnConfig[] = [];
  public isUserLocalQueryTerm: boolean;

  constructor(public modalService: NzModalService,
              public $message: FiLinkModalService,
              public $systemParameterService: SystemForCommonService,
              public tableQueryTermStoreService: TableQueryTermStoreService,
              public tableService: TableService) {
  }

  ngOnInit(): void {
    this.listOfSelection = [
      {
        text: this.language.table.SelectAllRow,
        onSelect: () => {
          this.checkAll(true);
        }
      },
      {
        text: this.language.table.SelectOddRow,
        onSelect: () => {
          this.dataSet.forEach((data, index) => data.checked = index % 2 !== 0);
          this.refreshCheckStatus();
        }
      },
      {
        text: this.language.table.SelectEvenRow,
        onSelect: () => {
          this.dataSet.forEach((data, index) => data.checked = index % 2 === 0);
          this.refreshCheckStatus();
        }
      }
    ];
    this.initIndexNo();
    // this.queryTerm = this.tableService.initFilterParams(this.tableConfig);
    this.resizeProxyId = CommonUtil.getUUid();
    this.tableId = CommonUtil.getUUid();
    if (navigator.userAgent.indexOf('Firefox') > -1) {
      this.isFireFox = true;
    }
  }

  ngOnDestroy(): void {
    this.pageBean = null;
    this.queryTerm = null;
    this.exportQueryTerm = null;
    this.tableConfig = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet) {
      // 开启本地查询逻辑
      if (!this.tableConfig.closeCacheQueryConditions) {
        this.openLocalQueryTermSearch(changes);
      }
      // 如果是树表 创建父子结构
      if (this.tableConfig.columnConfig[0].type === 'expend') {
        this.dataSet.forEach((item, index) => {
          item.serialNumber = index + this.pageBean.pageSize * (this.pageBean.pageIndex - 1) + 1;
          const expendDataKey = this.tableConfig.columnConfig[0].expendDataKey;
          if (item[expendDataKey] && item[expendDataKey].length > 0) {
            (function setFather(data) {
              data[expendDataKey].forEach((_item, _index) => {
                _item.father = data;
                // 当前告警表格展开不带上父级区域名称
                // _item.areaName = `${_item['father'].areaName}-${_item.areaName}`;
                _item.serialNumber = `${data.serialNumber}-${_index + 1}`;
                if (_item[expendDataKey] &&
                  _item[expendDataKey].length > 0) {
                  setFather(_item);
                }
              });
            })(item);
          }
        });
      } else {
        if (this.tableConfig.keepSelected) {
          this.updateSelectedData();
        }
      }
      // 为了解决第一次进入表格 有nz-switch产生的动画
      Promise.resolve().then(() => {
        this.showPagination = this.tableConfig.showPagination && this.dataSet && Boolean(this.dataSet.length);
      });
      if (changes.selectedData && changes.selectedData.currentValue.length) {
        this.keepSelectedData.clear();
        this.selectedData.forEach(item => {
          this.keepSelectedData.set(item[this.tableConfig.selectedIdKey], item);
        });
        this.updateSelectedData();
      }
      this.checkStatus();
      this.calcTableHeight();
    }
    if (changes.tableConfig) {
      this.configurableColumn = this.tableConfig.columnConfig.filter(item => item.configurable);
      this.queryTerm = this.tableService.initFilterParams(this.tableConfig);
      // this.searchAgain();
      if (this.tableConfig && this.tableConfig.columnConfig) {
        this.tableConfig.columnConfig.forEach(item => {
          if (item.searchable && item.searchConfig && item.searchConfig.type === 'dateRang'
            && item.searchConfig.initialValue && item.searchConfig.initialValue.length) {
            // 将时间段的初始值 赋值给rangDateValue变量，以此回显
            this.rangDateValue[item.key] = [new Date(item.searchConfig.initialValue[0]), new Date(item.searchConfig.initialValue[1])];
          }
        });
      }
      this.calcTableHeight();
      // 获取表格列设置
      if (this.tableConfig.primaryKey) {
        this.getColumnSettings();
      }
      // 计算表格宽度
      this.updateTableWidth();
      this.toggleHiddenOperateColumn(this.tableConfig.showSearch);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateTableWidth();
    });

  }


  public refreshCheckStatus(status?: boolean, data?): void {
    // 当为树表的情况
    if (this.tableConfig.columnConfig[0].type === 'expend') {
      const key = this.tableConfig.columnConfig[0].expendDataKey;
      if (data[key]) {
        this.tableService.recursiveSetChildData(data[key], key, status);
      }
      this.allChecked = this.dataSet.every(value => value.checked === true);
      this.allUnChecked = this.tableService.checkStatus(this.dataSet, key);
    } else {
      this.checkStatus();
      if (this.tableConfig.keepSelected) {
        this.collectSelectedId(status, data);
      }
    }
    if (this.tableConfig.handleSelect) {
      this.tableConfig.handleSelect(this.getDataChecked(), data);
    }
  }

  /**
   *  检查全选、有选状态
   */
  public checkStatus(): void {
    if (this.dataSet.length > 0) {
      const allChecked = this.dataSet.every(value => value.checked === true);
      const allUnChecked = this.dataSet.every(value => !value.checked);
      this.allChecked = allChecked;
      this.allUnChecked = allUnChecked;
      this.indeterminate = (!allChecked) && (!allUnChecked);
    } else {
      this.allChecked = false;
      this.indeterminate = false;
      this.allUnChecked = true;
    }
  }

  public getDataChecked(): any[] {
    let newArr: any[] = [];
    if (this.tableConfig.keepSelected) {
      newArr = [...this.keepSelectedData.values()];
    } else {
      const that = this;
      (function _getTreeDataChecked(data) {
        data.forEach((item: TreeNodeModel) => {
          if (item.checked) {
            newArr.push(item);
          }
          if (item[that.tableConfig.columnConfig[0].expendDataKey] && item[that.tableConfig.columnConfig[0].expendDataKey].length > 0) {
            _getTreeDataChecked(item[that.tableConfig.columnConfig[0].expendDataKey]);
          }
        });
      })(this.dataSet);
    }
    return newArr;
  }

  public checkAll(value: boolean): void {
    // 当为树表的情况
    if (this.tableConfig.columnConfig[0].type === 'expend') {
      const key = this.tableConfig.columnConfig[0].expendDataKey;
      this.dataSet.forEach(data => {
        data.checked = value;
        if (data[key] && data[key].length > 0) {
          this.tableService.recursiveSetChildData(data[key], key, value);
        }
      });
    } else {
      this.dataSet.forEach(data => data.checked = value);
    }
    this.checkStatus();
    if (this.tableConfig.keepSelected) {
      this.dataSet.forEach(item => {
        this.collectSelectedId(value, item);
      });
    }
    if (this.tableConfig.handleSelect) {
      this.tableConfig.handleSelect(this.getDataChecked());
    }
    // 全选为全选所有页数据时 默认全选效果是全选当前页
    if (this.isCheckAll) {
      this.checkAllClickEvent.emit(value);
    }
  }

  public refreshStatus(e): void {
    this.pageChange.emit(this.pageBean);
  }

  public pageSizeChange(pageSize: number) {
    if (Math.ceil(this.pageBean.Total / pageSize) < this.pageBean.pageIndex) {
      return;
    }
    this.pageChange.emit(this.pageBean);
  }

  public handle(operation: Operation, index: number, data, key: string) {
    if (data[key] === 'disabled') {
      return;
    }
    if (operation.needConfirm) {
      this.modalService.confirm(this.tablePrompt(() => {
        this.tableConfig.operation[index].handle(data);
      }, () => {
      }, operation.confirmTitle, operation.confirmContent));
    } else {
      this.tableConfig.operation[index].handle(data);
    }

  }

  public topHandle(operation: Operation): void {
    if (this.tableConfig.isLoading || operation.disabled) {
      return;
    }
    if (operation.needConfirm) {
      this.modalService.confirm(this.tablePrompt(() => {
        const data = this.getDataChecked();
        operation.handle(data);
      }, () => {
      }, operation.confirmTitle, operation.confirmContent));
    } else {
      const data = this.getDataChecked();
      operation.handle(data);
    }
  }

  public sort(event, key: string): void {
    if (event) {
      const sortCondition = new SortCondition();
      sortCondition.sortField = key;
      if (event === NzTableSortConfig.DESCEND) {
        sortCondition.sortRule = TableSortConfig.DESC;
      } else if (event === NzTableSortConfig.ASCEND) {
        sortCondition.sortRule = TableSortConfig.ASC;
      } else {
        sortCondition.sortRule = null;
      }
      this.tableConfig.sort(sortCondition);
    } else {
      this.tableConfig.sort({});
    }

  }

  /**
   * 过滤处理函数
   * param config
   * param $event
   */
  public handleFilter(config: ColumnConfig, $event): void {
    if (config.handleFilter) {
      config.handleFilter($event);
    }
  }

  public handleMouseMove(event, column: ColumnConfig): void {
    let target = event.target;
    while (target && target.tagName !== TableStylePixelEnum.TH_TAG_NAME) {
      target = target.parentNode;
    }
    const rect = target.getBoundingClientRect();
    const bodyStyle = document.body.style;
    // (虚拟滚动会有小问题，先禁用固定列拖拽列宽)
    if (!this.dragging && this.tableConfig.isDraggable &&
      (!column.fixedStyle || this.tableConfig.columnConfig[0].type !== 'expend') && rect.width > 12 &&
      rect.right - event.pageX < 8) {
      bodyStyle.cursor = 'col-resize';
      target.style.cursor = 'col-resize';
      this.draggingColumn = column;
      if (column.hasOwnProperty('isShowSort')) {
        column.isShowSort = false;
      }
    } else if (!this.dragging) {
      bodyStyle.cursor = '';
      target.style.cursor = '';
      this.draggingColumn = null;
      if (column.hasOwnProperty('isShowSort')) {
        column.isShowSort = true;
      }
    }

  }

  public handleMouseDown(event, column: ColumnConfig): void {
    let target = event.target;
    while (target && target.tagName !== 'TH') {
      target = target.parentNode;
    }
    const table = document.getElementById(this.tableId);
    const tableLeft = table.getBoundingClientRect().left;
    const columnRect = target.getBoundingClientRect();
    const resizeProxy = document.getElementById(this.resizeProxyId);
    if (this.tableConfig.isDraggable && this.draggingColumn) {
      const minLeft = columnRect.left - tableLeft + (this.draggingColumn.minWidth || TableStyleConfigEnum.MIN_WIDTH);
      this.dragging = true;
      this.resizeProxyShow = true;
      this.dragState = {
        startMouseLeft: event.clientX,
        startLeft: columnRect.right - tableLeft,
        startColumnLeft: columnRect.left - tableLeft,
        tableLeft
      };
      resizeProxy.style.left = this.dragState.startLeft + TableStylePixelEnum.PIXEL;
      const handleMouseMove = (_event) => {
        const deltaLeft = _event.clientX - this.dragState.startMouseLeft;
        const proxyLeft = this.dragState.startLeft + deltaLeft;
        resizeProxy.style.left = Math.max(minLeft, proxyLeft) + TableStylePixelEnum.PIXEL;

      };
      const handleMouseUp = () => {
        if (this.dragging) {
          const {startColumnLeft, startLeft} = this.dragState;
          const finalLeft = parseInt(document.getElementById(this.resizeProxyId).style.left, 10);
          const columnWidth = finalLeft - startColumnLeft;
          // 设置table的宽度
          this.tableConfig.scroll.x = parseInt(this.tableConfig.scroll.x, 10) + (finalLeft - startLeft) + TableStylePixelEnum.PIXEL;
          // this.draggingColumn.width = columnWidth;
          this.draggingColumn.width = this.draggingColumn.realWidth = columnWidth;
          this.updateLastButOneWidth(finalLeft - startLeft);
          // 如果拖动列为固定列重新计算所有固定列列宽 (虚拟滚动会有小问题)
          if (this.draggingColumn.fixedStyle && this.draggingColumn.fixedStyle.fixedLeft) {
            const changeColumn = this.tableConfig.columnConfig.filter(item => (item.fixedStyle && item.fixedStyle.fixedLeft));
            changeColumn.forEach((item, index) => {
              let left = 0;
              for (let i = index; i--; i > 0) {
                left += changeColumn[i].width;
              }
              item.fixedStyle.style.left = left + TableStylePixelEnum.PIXEL;
            });
          }
          this.draggingColumn = null;
          this.dragging = false;
          this.resizeProxyShow = false;
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }

  public handleMouseOut(event, column: ColumnConfig): void {
    document.body.style.cursor = '';
    if (column.hasOwnProperty('isShowSort')) {
      column.isShowSort = true;
    }
  }

  searchEvent(queryTerm) {
    this.queryTerm = queryTerm;
    this.handleSearch();
  }

  public handleSearch(): void {
    this.isUserLocalQueryTerm = true;
    let result;
    if (this.tableConfig.searchReturnType && this.tableConfig.searchReturnType === 'object') {
      result = this.tableService.createFilterConditionMap(this.queryTerm);
    } else {
      result = this.tableService.createFilterConditions(this.queryTerm);
    }
    // 点击查询之后把条件信息存入导出参数
    this.exportQueryTerm = result;
    this.tableConfig.handleSearch(result);
  }

  /**
   * 手动设置某一列过滤条件
   * param key
   * param value
   */
  public handleSetControlData(key: string, value: any): void {
    this.queryTerm.set(key, {
      filterValue: value,
      filterField: this.queryTerm.get(key).filterField,
      operator: this.queryTerm.get(key).operator
    });
  }

  public onChange(data: { key: string, value: any }): void {
    const event = data.value;
    const key = data.key;
    if (event) {
      this.queryTerm.get(key).filterValue = event.getTime();
    } else {
      this.queryTerm.get(key).filterValue = null;
    }

  }

  public rangValueChange(data: { key: string, value: any[] }): void {
    const event = data.value;
    const key = data.key;
    const startTime = event[0] ? CommonUtil.tableQueryTime(event[0].getTime()) : null;
    const endTime = event[1] ? CommonUtil.tableQueryTime(event[1].getTime()) : null;
    if (startTime && endTime) {
      this.queryTerm.get(key).filterValue = [startTime, endTime];
    } else {
      this.queryTerm.get(key).filterValue = null;
    }
  }

  public inputNumberValueChange($event): void {
    this.queryTerm.get($event.key).filterValue = $event.value;
  }

  public handleRest(): void {
    this.searchDate = {};
    this.rangDateValue = {};
    this.tableService.resetFilterConditions(this.queryTerm);
    this.handleSearch();
  }

  public openTableSearch(flag?): void {
    if (flag) {
      this.tableConfig.showSearch = flag === '1';
    } else {
      this.tableConfig.showSearch = !this.tableConfig.showSearch;
    }
    this.toggleHiddenOperateColumn(this.tableConfig.showSearch);
    if (this.tableConfig.openTableSearch) {
      this.tableConfig.openTableSearch(this.tableConfig.showSearch);
    }
  }

  /**
   * 点击导入 目前仅支持 单文件 .xlsx 格式
   */
  public clickImport(file: File): void {
    this.tableConfig.handleImport(file);
  }

  /**
   * 点击导出
   */
  public clickExport(): void {
    const modal = this.modalService.create({
      nzTitle: this.language.table.exportTemp,
      nzContent: this.exportTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzFooter: [
        {
          label: this.language.table.okText,
          onClick: () => {
            if (!this.exportRadioValue && this.exportRadioValue !== 0) {
              this.$message.error(this.language.table.exportTemp);
              return;
            }
            if (this.exportRadioValue === 'HTML') {
              setTimeout(() => {
                CommonUtil.exportHtml('FiLinkWeb.html');
              }, 500);
            } else {
              // 获取查询条件
              if (!this.exportQueryTerm) {
                if (this.tableConfig.searchReturnType && this.tableConfig.searchReturnType === 'object') {
                  this.exportQueryTerm = {};
                } else {
                  this.exportQueryTerm = [];
                }
              }
              // 获取当显示的列(排除序号操作展开等列)
              const column = this.tableConfig.columnConfig.filter(item => !item['hidden'] && (item.key && item.key !== 'serialNumber'));
              const __column = [];
              // 格式化参数
              column.forEach(item => {
                __column.push({
                  columnName: item.title,
                  propertyName: item.key
                });
              });
              const exportParams = {
                queryTerm: this.exportQueryTerm,
                selectItem: this.getDataChecked(),
                columnInfoList: __column,
                excelType: this.exportRadioValue,
              };
              this.tableConfig.handleExport(exportParams);
            }
            modal.destroy();
          }
        },
        {
          label: this.language.table.cancelText,
          type: 'danger',
          onClick: () => {
            modal.destroy();
          }
        },
      ]
    });
  }

  /**
   * 点击打印
   */
  public printList(): void {
    // 使用原生打印
    this.printVisible = false;
    setTimeout(() => {
      window.print();
    }, 200);
  }

  /**
   * 展开事件处理函数
   * param data
   * param event
   */
  public tableCollapse(data: any[], event: boolean, index?): void {
    // 先统一处理展开回调 后期可能会为每行展开加事件
    if (this.tableConfig.expandHandle) {
      this.tableConfig.expandHandle();
    }
    this.collapse(data, event);
  }

  /**
   * 关闭所有子数据
   * param data
   * param event
   */
  public collapse(data: any[], event: boolean): void {
    if (event === false) {
      data.forEach(item => {
        item.expand = false;
        if (item[this.tableConfig.columnConfig[0].expendDataKey] && item[this.tableConfig.columnConfig[0].expendDataKey].length > 0) {
          this.collapse(item[this.tableConfig.columnConfig[0].expendDataKey], event);
        }
      });
    } else {
      return;
    }
  }

  /**
   * 设置列下拉菜单显示状态改变
   * param event boolean
   */
  public dropDownChange(event: boolean): void {
    // 点击显示下拉菜单 不做处理
    if (event) {
      return;
    }
    // 为了三期做表格列的保存
  }

  /**
   * 自定义列 显示隐藏重新计算表格宽地
   * param event
   */
  public configurableColumnChange(event): void {
    event.item.hidden = !event.value;
    if (event.value) {
      this.updateTableWidth(true);
    } else {
      this.updateTableWidth();
    }
  }

  /**
   * 保存列设置
   */
  public saveColumn(): void {
    const temp = this.configurableColumn.map(item => {
      return {key: item.key, hidden: !!item.hidden};
    });
    const params = {menuId: this.tableConfig.primaryKey, custom: JSON.stringify(temp)};
    this.$systemParameterService.saveColumnSetting(params).subscribe((result: ResultModel<any>) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        // 保存成功更新本地存储
        this.columnSetting = temp;
        let columnSetting;
        if (this.tableConfig) {
          columnSetting = this.columnSettings.find(item => item.menuId === this.tableConfig.primaryKey);
        }
        if (columnSetting) {
          columnSetting.custom = params.custom;
        } else {
          this.columnSettings.push(params);
        }
        localStorage.setItem('columnSettings', JSON.stringify(this.columnSettings));
        this.setColumnVisible = false;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 获取表格列表设置
   */
  public getColumnSettings(): void {
    // 计算列设置查询本地有没有相关数据
    this.columnSettings = JSON.parse(localStorage.getItem('columnSettings')) || [];
    this.columnSetting = this.columnSettings.find(item => item.menuId === this.tableConfig.primaryKey);
    if (this.columnSetting) {
      this.setColumnSettings(JSON.parse(this.columnSetting.custom));
    } else {
      // 如果本地数据中没有相关数据，请求后台接口
      this.$systemParameterService.queryColumnSetting().subscribe((result: ResultModel<any>) => {
        if (result.code === 0 && result.data.length > 0) {
          // 保存后台服务器设置到本地缓存
          localStorage.setItem('columnSettings', JSON.stringify(result.data));
          let remoteColumnSetting;
          if (this.tableConfig) {
            remoteColumnSetting = result.data.find(item => item.menuId === this.tableConfig.primaryKey);
          }
          if (remoteColumnSetting) {
            this.setColumnSettings(JSON.parse(remoteColumnSetting.custom));
            this.updateTableWidth();
          }

        }
      });
    }
  }

  /**
   * 更新table 的宽度
   * param clearWidth 是否要清楚所有列的宽度
   */
  public updateTableWidth(clearWidth?: boolean): void {
    if (!document.getElementById(this.tableId)) {
      return;
    }
    const tableContainerWidth = document.getElementById(this.tableId).clientWidth - this.tableService.scrollBarWidth;
    this.currentShowColumns = this.tableConfig.columnConfig.filter(item => !item.hidden);
    // 列表最小宽度
    let tableMinWidth = 0;
    this.currentShowColumns.forEach(item => {
      // 如果当前显示列没有原始宽度，记录原始宽度
      if (!item.realWidth) {
        item.realWidth = item.width;
      }
      // 是否需要清除当前显示列的所有宽度
      if (clearWidth) {
        item.width = null;
      }
      tableMinWidth += this.tableService.getColumnWidth(item);
    });
    // 不出现滚动条
    if (tableMinWidth <= tableContainerWidth) {
      // 多余宽度
      const excessWidth = tableContainerWidth - tableMinWidth;
      // 最小总宽度
      const notFlexKey = ['select', 'expend', 'serial-number', 'operate'];
      const allFlexColumns = this.currentShowColumns.filter(item => {
        return !notFlexKey.includes(item.type) || (!item.type && !item.key);
      });
      const allColumnsWidth = allFlexColumns.reduce((prev, column) => prev + this.tableService.getColumnWidth(column), 0);
      // 每个像素伸缩宽度 多余宽度/ 最小总宽度
      const flexWidthPerPixel = excessWidth / allColumnsWidth;
      // 由于计算宽度时小数取整的时候会失去经度把多余的宽度给第一列
      let noFirstWidth = 0;
      allFlexColumns.forEach((column, index) => {
        if (index === 0) {
          return;
        }
        const flexWidth = Math.floor(this.tableService.getColumnWidth(column) * flexWidthPerPixel);
        noFirstWidth += flexWidth;
        column.width = this.tableService.getColumnWidth(column) + flexWidth;
      });
      allFlexColumns[0].width = this.tableService.getColumnWidth(allFlexColumns[0]) + excessWidth - noFirstWidth;
      if (this.tableConfig.scroll) {
        this.tableConfig.scroll.x = tableContainerWidth + TableStylePixelEnum.PIXEL;
      }
    } else {
      this.currentShowColumns.forEach(item => {
        item.width = this.tableService.getColumnWidth(item);
      });
      if (this.tableConfig.scroll) {
        this.tableConfig.scroll.x = tableMinWidth + TableStylePixelEnum.PIXEL;
      }
    }
  }

  /**
   * 计算表格高度
   */
  public calcTableHeight(): void {
    // 表格高度自动适配 340 为基础表格的外高度 如果表格上有其他高的控制占高度需要传入outHeight
    // const outHeight = this.tableConfig.outHeight || 0;
    if (this.tableConfig.scroll && (!this.tableConfig.noAutoHeight)) {
      this.tableConfig.scroll.y = TableStyleConfigEnum.TABLE_ROW_HEIGHT * (this.pageBean.pageSize + 1) + TableStylePixelEnum.PIXEL;
      this.tableConfig.scroll = {x: this.tableConfig.scroll.x, y: this.tableConfig.scroll.y};
    }
  }

  public onOpenChange(data: { key: string, value: any[] }): void {
    // 为了解决UI框架的bug而采用的无奈代码，重新赋值
    const event = data.value;
    const key = data.key;
    if (!event) {
      // 这里深拷贝一个对象
      let temp;
      if (this.rangDateValue[key] && this.rangDateValue[key].length === 2) {
        temp = [new Date(this.rangDateValue[key][0].getTime()), new Date(this.rangDateValue[key][1].getTime())];
        if (this.rangDateValue[key][0].getTime() > this.rangDateValue[key][1].getTime()) {
          // 当选时间的时候ui组件判断错误，赋值为开始的那个
          this.rangDateValue[key] = [];
          this.queryTerm.get(key).filterValue = null;
          this.$message.warning(this.language.common.timeMsg);
        } else {
          // this.rangDateValue[key] = [];
          this.rangDateValue[key] = temp;
        }
      } else {
        this.rangDateValue[key] = [];
        this.queryTerm.get(key).filterValue = null;
      }
    }

  }

  public collectSelectedId(checked: boolean, item: any): void {
    const key = item[this.tableConfig.selectedIdKey];
    if (checked) {
      if (!this.keepSelectedData.has(key)) {
        this.keepSelectedData.set(key, item);
      }
    } else {
      // 添加size大于0的判断
      if (this.keepSelectedData.size > 0 && this.keepSelectedData.has(key)) {
        this.keepSelectedData.delete(key);
      }
    }
  }

  public updateSelectedData(): void {
    this.dataSet.forEach(item => {
      item.checked = this.keepSelectedData.has(item[this.tableConfig.selectedIdKey]);
      this.collectSelectedId(item.checked, item);
    });
  }

  public updateSelectedDataNoCheck(): void {
    this.dataSet.forEach(item => {
      this.collectSelectedId(item.checked, item);
    });
  }

  public toggleHiddenOperateColumn(hidden?: boolean): void {
    if (this.tableConfig.showSearchSwitch) {
      if (!this.tableConfig.operation || (this.tableConfig.operation && this.tableConfig.operation.length === 0)) {
        const column = this.tableConfig.columnConfig.find(item => item.searchConfig && item.searchConfig.type === 'operate');
        if (column) {
          if (hidden !== undefined) {
            column.hidden = !hidden;
          } else {
            column.hidden = !column.hidden;
          }
        }
      }
    }
  }

  public rowClick(data): void {
    if (this.tableConfig.rowClick) {
      this.tableConfig.rowClick(data);
    }
  }

  /**
   * 当查询条件存在的时候重新查询
   */
  public searchAgain() {
    const localQueryTerm = this.tableQueryTermStoreService.applyQueryTerm(this.tableConfig.primaryKey);
    if (localQueryTerm) {
      this.tableConfig.isLoading = true;
      this.queryTerm = localQueryTerm;
      let sum = 0;
      this.queryTerm.forEach((value, key) => {
        if (value.filterValue) {
          sum++;
        }
        if (value.filterType === 'dateRang' && value.filterValue && value.filterValue.length) {
          this.rangDateValue[key] = [new Date(value.filterValue[0]), new Date(value.filterValue[1])];
        }
        if (value.filterType === 'date' && value.filterValue) {
          this.searchDate[key] = new Date(value.filterValue);
        }
      });
      if (!this.tableConfig.showSearch) {
        const flag = sum > 0 ? '1' : '0';
        this.openTableSearch(flag);
      }
      this.handleSearch();
    }
  }

  /**
   * 开始本地查询逻辑
   * 当第一次的值回来之后 如果缓存中有本查询条件，开启第二次查询否则使用第一次的值
   * param changes
   */
  public openLocalQueryTermSearch(changes: SimpleChanges): void {
    if (changes.dataSet.currentValue && changes.dataSet.currentValue.length && !this.isUserLocalQueryTerm) {
      const localQueryTerm = this.tableQueryTermStoreService.applyQueryTerm(this.tableConfig.primaryKey);
      if (localQueryTerm) {
        this.searchAgain();
        this.dataSet = [];
      }
    }
    // 使用本地缓存条件查询、并且等查询后的数据回来了再保存查询条件
    if (this.isUserLocalQueryTerm) {
      if (this.tableConfig.primaryKey) {
        this.tableQueryTermStoreService.updateQueryTerm(this.tableConfig.primaryKey, this.queryTerm);
      }
    }
  }

  /**
   * 查询出当前表格的列设置
   * param columnSetting
   */
  private setColumnSettings(columnSetting): void {
    this.configurableColumn.forEach(item => {
      columnSetting.forEach(_item => {
        if (item.key === _item.key) {
          item.hidden = _item.hidden;
        }
      });
    });
    this.configurableColumn = [...this.configurableColumn];
  }

  /**
   * 更新最后一列的宽度
   * param offsetWidth
   */
  private updateLastButOneWidth(offsetWidth: number): void {
    // 防止tab切换的问题
    if (this.currentShowColumns.length === 0) {
      this.currentShowColumns = this.tableConfig.columnConfig.filter(item => !item.hidden);
    }
    let lastButOneIndex = this.currentShowColumns.findIndex(item => !item.type && !item.key);
    // 当有操作列时候最后一列为操作列的前一列，没有则是最后一列
    lastButOneIndex = lastButOneIndex > 0 ? this.currentShowColumns.length - 2 : this.currentShowColumns.length - 1;
    let currentWidth = 0;
    this.currentShowColumns.forEach((item, index) => {
      // 最后一列不计入宽度
      if (index !== lastButOneIndex) {
        currentWidth += item.width || TableStyleConfigEnum.DEFAULT_COLUMN_WIDTH;
      }
    });
    const tableContainerWidth = document.getElementById(this.tableId).clientWidth - this.tableService.scrollBarWidth;
    const lastButOne = this.currentShowColumns[lastButOneIndex];
    // 计算倒数第二列的宽度
    // 不出现滚动条的情况
    if (currentWidth < tableContainerWidth) {
      // 拖拽宽度减小
      if (offsetWidth < 0) {
        if (!lastButOne.realWidth) {
          lastButOne.realWidth = lastButOne.width;
        }
        lastButOne.width = tableContainerWidth - Number(currentWidth);
        this.tableConfig.scroll.x = tableContainerWidth + TableStylePixelEnum.PIXEL;
      } else {
        if (lastButOne.realWidth) {
          // 最后一列大于原来的宽度
          if (lastButOne.width - offsetWidth > lastButOne.realWidth) {
            lastButOne.width = lastButOne.width - offsetWidth;
            this.tableConfig.scroll.x = tableContainerWidth + TableStylePixelEnum.PIXEL;
          } else {
            // 最后一列小于原来的宽度 进行宽度补偿
            const lastButOneOffset = lastButOne.width - lastButOne.realWidth;
            lastButOne.width = lastButOne.realWidth;
            this.tableConfig.scroll.x = tableContainerWidth + offsetWidth - lastButOneOffset + TableStylePixelEnum.PIXEL;
          }
        }
      }
    }
  }

  /**
   * 初始化序号
   */
  private initIndexNo(): void {
    if (!this.tableConfig.noIndex) {
      const columnConfig = {
        select: true,
        expand: true
      };
      let index = 0;
      this.tableConfig.columnConfig.forEach(item => {
        if (item.type in columnConfig) {
          index++;
        }
      });
      this.tableConfig.columnConfig.splice(index, 0, {
        type: 'serial-number', width: 62, title: this.language.facility.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      });
    }
  }

  /**
   * 表格统一提示配置
   * param handleOK
   * param handleCancel
   * returns any
   */
  private tablePrompt(handleOK: () => void, handleCancel: () => void, title: string, content: string): ModalOptionsForService<() => void> {
    // 采用确定和取消互换
    const obj = {
      nzTitle: title || this.language.table.prompt,
      nzContent: content || `<span>${this.language.table.promptContent}</span>`,
      nzOkText: this.language.table.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: handleCancel,
      nzKeyboard: false,
      nzCancelText: this.language.table.okText,
      nzOnCancel: handleOK,
    };
    return obj;
  }
}
