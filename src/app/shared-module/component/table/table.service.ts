/**
 * Created by xiaoconghu on 2018/12/13.
 */
import {Inject, Injectable} from '@angular/core';
import {ColumnConfig, TableConfigModel} from '../../model/table-config.model';
import {FilterCondition} from '../../model/query-condition.model';
import {OperatorEnum} from '../../enum/operator.enum';
import {TIME_EXTRA} from '../../const/time-extra';
import {CommonUtil} from '../../util/common-util';
import {DOCUMENT} from '@angular/common';
import {TableStyleConfigEnum} from '../../enum/table-style-config.enum';
import {TableQueryTermStoreService} from '../../../core-module/store/table-query-term.store.service';

@Injectable()
export class TableService {

  private _scrollbarWidth: number;
  private scrollbarMeasure = {
    position: 'absolute',
    top: '-9999px',
    width: '50px',
    height: '50px',
    overflow: 'scroll'
  };

  constructor(@Inject(DOCUMENT) private document: any, private tableQueryTermStoreService: TableQueryTermStoreService) {
    this.initScrollBarWidth();
  }

  get scrollBarWidth(): number {
    if (this._scrollbarWidth) {
      return this._scrollbarWidth;
    }
    this.initScrollBarWidth();
    return this._scrollbarWidth;
  }

  /**
   * 初始化过滤字段
   * param {TableConfigModel} tableConfig
   * returns {Map<string, FilterCondition>}
   */
  public initFilterParams(tableConfig: TableConfigModel): Map<string, FilterCondition> {
    const queryTerm = new Map();
    if (tableConfig && tableConfig.columnConfig) {
      tableConfig.columnConfig.forEach(item => {
        if (item.searchable && item.key) {
          const filterCondition = new FilterCondition(item.searchKey || item.key);
          filterCondition.filterType = item.searchConfig.type;
          if (item.searchConfig.initialValue) {
            filterCondition.filterValue = item.searchConfig.initialValue;
            filterCondition.initialValue = item.searchConfig.initialValue;
          }
          if (item.searchConfig.type === 'input') {
            filterCondition.operator = OperatorEnum.like;
          } else if (item.searchConfig.selectType === 'multiple') {
            filterCondition.operator = OperatorEnum.in;
          } else {
            filterCondition.operator = OperatorEnum.eq;
          }
          queryTerm.set(item.key, filterCondition);
        }
      });
    }
    return queryTerm;
  }

  /**
   * 创建数组过滤条件
   * param {Map<string, FilterCondition>} queryTerm
   * returns {FilterCondition[]}
   */
  public createFilterConditions(queryTerm: Map<string, FilterCondition>): FilterCondition[] {
    const filterConditions = [];
    queryTerm.forEach(value => {
      // 当filterType时间段的并且返回值存在
      if (value.filterType === 'dateRang' && value.filterValue instanceof Array && value.filterValue.length > 0) {
        const temp = value.filterValue;
        const {filterField, operator} = value;
        const start = {filterValue: 0, filterField, operator}, end = {filterValue: 0, filterField, operator};
        // 去除随机的毫秒值补000
        start.filterValue = Math.floor(temp[0] / 1000) * 1000;
        start.operator = OperatorEnum.gte;
        start['extra'] = TIME_EXTRA;
        start.filterField = filterField;
        // 去除随机的毫秒值补999
        end.filterValue = Math.floor(temp[1] / 1000) * 1000 + 999;
        end.operator = OperatorEnum.lte;
        end['extra'] = TIME_EXTRA;
        end.filterField = filterField;
        // 当两个值都有的情况下加入到查询条件里面
        if (start.filterValue && end.filterValue) {
          filterConditions.push(start, end);
        }
        // 对date类型处理
      } else if (value.filterType === 'date' && value.filterValue) {
        const {filterValue, filterField, operator} = value;
        const temp = {filterValue, filterField, operator};
        const date = CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', new Date(value.filterValue));
        temp.filterValue = new Date(date).getTime();
        filterConditions.push(temp);
      } else {
        const {filterValue, filterField, operator} = value;
        // 当操作符为‘in’并且有值的情况
        if (operator === OperatorEnum.in) {
          if (filterValue && filterValue.length > 0) {
            filterConditions.push({filterValue, filterField, operator});
          }
        } else {
          if (filterValue) {
            // 如果是operator为like出去首尾空格
            if (operator === OperatorEnum.like) {
              const __filterValue = filterValue.trim();
              filterConditions.push({filterValue: __filterValue, filterField, operator});
            } else {
              filterConditions.push({filterValue, filterField, operator});
            }
          }
        }
      }
    });
    return filterConditions;
  }

  /**
   * 清空所有条件
   * param {Map<string, FilterCondition>} queryTerm
   */
  public resetFilterConditions(queryTerm: Map<string, FilterCondition>): void {
    queryTerm.forEach((value, key) => {
      if (value.initialValue && value.initialValue !== 0) {
        value.filterValue = value.initialValue;
      } else {
        value.filterValue = null;
        value.filterName = null;
        if (value.operator && value.operator !== OperatorEnum.like && value.operator !== OperatorEnum.in) {
          value.operator = OperatorEnum.eq;
        }
      }
    });
  }

  /**
   * 创建一个map对象过滤条件
   * param {Map<string, FilterCondition>} queryTerm
   * returns {Map<string, any>}
   */
  public createFilterConditionMap(queryTerm: Map<string, FilterCondition>): Object {
    const query = Object.create(null);
    queryTerm.forEach((value, key) => {
      // 如果是operator为like出去首尾空格
      if (value.operator === OperatorEnum.like && value.filterValue) {
        query[value.filterField] = value.filterValue.trim();
      } else {
        query[value.filterField] = value.filterValue;
      }
    });
    return query;
  }

  /**
   * 判断所有子元素是否都没有选中
   * param data
   * param expendDataKey 子元素数组名字 string
   */
  public checkStatus(data, expendDataKey): boolean {
    // 全不选
    let allUnChecked = true;
    (function checkAllData(_data) {
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].checked) {
          allUnChecked = false;
          break;
        }
        if (_data[i][expendDataKey] && _data[i][expendDataKey].length > 0) {
          checkAllData(_data[i][expendDataKey]);
        }
      }
    })(data);
    return allUnChecked;
  }

  /**
   * 获取当前列的宽度
   * param column
   */
  public getColumnWidth(column: ColumnConfig): number {
    return column.width || column.realWidth || TableStyleConfigEnum.DEFAULT_COLUMN_WIDTH;
  }

  /**
   * 递归设置子集数据的选中状态
   * param childData 子集数据
   * param expendDataKey 子集数据key
   * param status 状态
   */
  public recursiveSetChildData(childData, expendDataKey, status): void {
    childData.forEach(item => {
      item.checked = status;
      if (item[expendDataKey] && item[expendDataKey].length > 0) {
        this.recursiveSetChildData(item[expendDataKey], expendDataKey, status);
      }
    });
  }

  /**
   * 初始化计算滚动条宽度
   */
  private initScrollBarWidth(): void {
    const scrollDiv = this.document.createElement('div');
    for (const scrollProp in this.scrollbarMeasure) {
      if (this.scrollbarMeasure.hasOwnProperty(scrollProp)) {
        scrollDiv.style[scrollProp] = this.scrollbarMeasure[scrollProp];
      }
    }
    this.document.body.appendChild(scrollDiv);
    const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.document.body.removeChild(scrollDiv);
    this._scrollbarWidth = width;
  }
}
