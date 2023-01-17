import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService, NzTableComponent} from 'ng-zorro-antd';
import {TableService} from '../table.service';
import {TableComponent} from '../table.component';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {TableStylePixelEnum} from '../../../enum/table-style-pixel.enum';
import {TableStyleConfigEnum} from '../../../enum/table-style-config.enum';
import {SystemForCommonService} from '../../../../core-module/api-service/system-setting';
import {AreaLevelEnum} from '../../../../core-module/enum/area/area.enum';
import {TableQueryTermStoreService} from '../../../../core-module/store/table-query-term.store.service';

declare var $: any;

/**
 * 虚拟表格组件
 */
@Component({
  selector: 'xc-table-virtual',
  templateUrl: './table-virtual.component.html',
  styleUrls: ['../table.component.scss'],
  providers: [TableService]
})
export class TableVirtualComponent extends TableComponent implements OnInit, OnChanges, OnDestroy {
  // 显示级别的待选项
  @Input() selectedOption = [];
  // 显示级别的待选项placeHolder
  @Input() selectedPlaceHolder;
  // 级别字段key
  @Input() levelKey = 'level';
  // 名称字段key
  @Input() nameKey = 'areaName';
  @ViewChild('nzTable') nzTable: NzTableComponent;
  // 放入虚拟滚动视图的数据
  public __dataSet = [];
  // 选择显示级别的值
  public selectedValue = 0;
  // 虚拟滚动最大Buffer高度
  public nzVirtualMaxBufferPx;
  // 没数据值
  public nzNoResult = '';
  // 列表最大高度
  private tableMaxHeight;

  constructor(public modalService: NzModalService,
              public i18n: NzI18nService,
              public $message: FiLinkModalService,
              public $systemParameterService: SystemForCommonService,
              public tableQueryTermStoreService: TableQueryTermStoreService,
              public tableService: TableService) {
    super(modalService, $message, i18n, $systemParameterService, tableQueryTermStoreService, tableService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSet) {
      // 开启本地查询逻辑
      if (!this.tableConfig.closeCacheQueryConditions) {
        this.openLocalQueryTermSearch(changes);
      }
      this.selectedValue = null;
      this.checkStatus();
      // 计算表格高度
      const outHeight = this.tableConfig.outHeight || 0;
      this.tableMaxHeight = $(window).height() - 310 - outHeight;
      if (Math.floor((this.tableMaxHeight / TableStyleConfigEnum.TABLE_ROW_HEIGHT)) > this.dataSet.length) {
        // 计算数据量应占的高度
        this.nzVirtualMaxBufferPx = this.calcVirtualTableHeight(this.dataSet.length);
      } else {
        this.nzVirtualMaxBufferPx = this.tableMaxHeight;
      }
      if (!this.tableConfig.noAutoHeight) {
        this.tableConfig.scroll.y = this.nzVirtualMaxBufferPx + TableStylePixelEnum.PIXEL;
      }
      // 如果是树表 创建父子结构
      if (this.tableConfig.columnConfig[0].type === 'expend') {
        const arr = [];
        this.dataSet.forEach((item, index) => {
          arr.push(item);
          item.serialNumber = index + 1;
          const areaLevelName = this.i18n.translate(`facility.${AreaLevelEnum[item[this.levelKey]]}`);
          item[this.nameKey + 'Title'] = `${areaLevelName}:${item[this.nameKey]}\n`;
          if (item[this.tableConfig.columnConfig[0].expendDataKey] && item[this.tableConfig.columnConfig[0].expendDataKey].length > 0) {
            const that = this;
            (function setFather(data) {
              data[that.tableConfig.columnConfig[0].expendDataKey].forEach((_item, _index) => {
                _item.father = data;
                if (data['expand']) {
                  arr.push(_item);
                }
                _item.serialNumber = `${data.serialNumber}-${_index + 1}`;
                const _areaLevelName = that.i18n.translate(`facility.${AreaLevelEnum[_item[that.levelKey]]}`);
                _item[that.nameKey + 'Title'] = `${data[that.nameKey + 'Title']}${_areaLevelName}:${_item[that.nameKey]}\n`;
                if (_item[that.tableConfig.columnConfig[0].expendDataKey] &&
                  _item[that.tableConfig.columnConfig[0].expendDataKey].length > 0) {
                  setFather(_item);
                }
              });
            })(item);
          }
        });
        this.__dataSet = [];
        this.nzNoResult = ' ';
        setTimeout(() => {
          this.__dataSet = arr;
          this.nzNoResult = this.language.table.noData;
        });
      }
    }
    if (changes.tableConfig) {
      this.configurableColumn = this.tableConfig.columnConfig.filter(item => item.configurable);
      this.queryTerm = this.tableService.initFilterParams(this.tableConfig);
      // this.searchAgain();
      // 获取表格列设置
      if (this.tableConfig.primaryKey) {
        this.getColumnSettings();
      }
      this.updateTableWidth();
    }
  }

  ngOnDestroy(): void {
    this.pageBean = null;
    this.queryTerm = null;
    this.exportQueryTerm = null;
    this.tableConfig = null;
    this.nzTable = null;
  }

  /**
   * 展开事件处理函数
   * param data
   * param event
   */
  public tableCollapse(_data: any[], event: boolean, index: number) {
    // 先统一处理展开回调 后期可能会为每行展开加事件
    if (this.tableConfig.expandHandle) {
      this.tableConfig.expandHandle();
    }
    this.selectedValue = null;
    this.collapse(_data, event);
    // 如果展开开启滚动补偿机制
    if (event) {
      this.scrollCompensate(index);
    }
  }

  /**
   * 展开指定子集
   * param zIndex
   */
  public openChildren(zIndex: number): void {
    this.selectedValue = zIndex;
    const arr = [];
    const openRecursive = (data) => {
      data.forEach(item => {
        item.expand = Number(item[this.levelKey]) <= zIndex;
        if (item.father) {
          if (item.father.expand) {
            arr.push(item);
          }
        } else {
          arr.push(item);
        }
        if (item[this.tableConfig.columnConfig[0].expendDataKey] && item[this.tableConfig.columnConfig[0].expendDataKey].length) {
          openRecursive(item[this.tableConfig.columnConfig[0].expendDataKey]);
        }
      });
    };
    openRecursive(this.dataSet);
    this.__dataSet = arr;
    this.__dataSet = [];
    this.nzNoResult = ' ';
    setTimeout(() => {
      this.__dataSet = arr;
      this.nzNoResult = this.language.table.noData;
      this.resetTableHeight();
    });
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
    }
    const arr = [];
    this.dataSet.forEach(item => {
      arr.push(item);
      if (item[this.tableConfig.columnConfig[0].expendDataKey] && item[this.tableConfig.columnConfig[0].expendDataKey].length > 0) {
        const that = this;
        (function setFather(_data) {
          _data[that.tableConfig.columnConfig[0].expendDataKey].forEach(_item => {
            if (_data['expand']) {
              arr.push(_item);
            }
            if (_item[that.tableConfig.columnConfig[0].expendDataKey] &&
              _item[that.tableConfig.columnConfig[0].expendDataKey].length > 0) {
              setFather(_item);
            }
          });
        })(item);
      }
    });
    this.__dataSet = arr;
    this.resetTableHeight();
  }

  /**
   * 重新计算表格高度(树表小数据量使用)
   */
  public resetTableHeight(): void {
    // 当树表第一层的数据比较少的时候重新计算树表格的高度
    // if (this.dataSet.length < 5) {
    // 计算当前数据应有高度
    const tableHeight = this.calcVirtualTableHeight(this.__dataSet.length);
    if (tableHeight < this.tableMaxHeight) {
      this.nzVirtualMaxBufferPx = tableHeight;
    } else {
      this.nzVirtualMaxBufferPx = this.tableMaxHeight;
    }
    if (!this.tableConfig.noAutoHeight) {
      this.tableConfig.scroll.y = this.nzVirtualMaxBufferPx + TableStylePixelEnum.PIXEL;
    }

    // }
  }

  /**
   * 滚动补偿机制
   * param index
   */
  private scrollCompensate(index: number): void {
    // 当前index的高度
    const height = index * TableStyleConfigEnum.TABLE_ROW_HEIGHT;
    // 页面卷曲的高度
    const scrollTop = this.nzTable.cdkVirtualScrollNativeElement.scrollTop;
    // 当前展开条数在页面地步最后一条滚动到下一条
    if ((Number.parseInt(this.tableConfig.scroll.y, 10) - (height - scrollTop)) < (TableStyleConfigEnum.TABLE_ROW_HEIGHT * 2)) {
      const scrollHeight = TableStyleConfigEnum.TABLE_ROW_HEIGHT * (index + 1);
      this.nzTable.cdkVirtualScrollNativeElement.scrollTo({top: scrollHeight});
    }
  }

  /**
   * 根据数量计算表格的高度
   * 无数据 不计算滚动条的高度
   * param length
   */
  private calcVirtualTableHeight(length: number): number {
    if (length) {
      return length * TableStyleConfigEnum.TABLE_ROW_HEIGHT + this.tableService.scrollBarWidth + 1;
    } else {
      return 0;
    }
  }
}
