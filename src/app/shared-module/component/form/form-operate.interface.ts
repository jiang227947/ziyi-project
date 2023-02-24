/**
 * Created by jzy
 */
import {AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {FormItem, Rule} from './form-config';

/**
 * 表单操作接口类
 */
export interface FormOperateInterface {
  /**
   * 创建列
   */
  createColumn(data): void;

  /**
   * 向指定位置新增列
   *  param {FormItem} formItem
   *  param {number} _index
   */
  addColumn(formItem: FormItem, _index?: number): void;

  /**
   * 删除列
   *  param {string} key
   */
  deleteColumn(key: string): void;

  /**
   * 查询配置列中是否有某一列
   *  param {string} key
   *  returns {{index: string; item?: FormItem}}
   */
  getColumn(key: string): { index: number, item?: FormItem };

  /**
   * 设置表单列是hidden 方法
   * param keys
   * param value
   */
  setColumnHidden(keys: string[], value: boolean): void;
  /**
   * 为单个列新增校验规则
   *  param {FormItem} formItem
   */
  addValidRule(formItem: FormItem): void;

  /**
   * 删除单个列的校验规则
   *  param {FormItem} formItem
   */
  deleteValidRule(formItem: FormItem): void;

  /**
   * 新增 同步 HTML 页面显示 校验规则 和 错误信息
   *  param {Rule[]} rule
   *  returns {ValidatorFn[]}
   */
  addRule(rule: Rule[]): ValidatorFn[];

  /**
   * 新增异步校验规则
   *  param rules
   *  returns {AsyncValidatorFn[]}
   */
  addAsyncRule(rules: { asyncRule: AsyncValidatorFn, asyncCode: any }[]): AsyncValidatorFn[];

  /**
   * 删除错误信息
   *  param {FormItem} FormItem
   */
  deleteRule(fromItem: FormItem): void;

  /**
   * 重置所有的列
   *  param value
   *  param {{onlySelf?: boolean; emitEvent?: boolean}} options
   */
  resetData(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean; });

  /**
   * 重置单个列
   *  param {FormItem} formItem
   *  param value
   *  param {Object} options 可以将表单状态例如 {valid:true}
   */
  resetControlData(key: string, value?: any, options?: object): void;

  /**
   * 获取数据
   *  returns {any}
   */
  getData(key?: string): any;

  /**
   * 获取表单数据 包含disable状态的
   * 不包含表单hidden为true的
   */
  getRealData(): any;
  /**
   * 获取表单的验证状态
   *  param {string} key
   *  returns {boolean}
   */
  getValid(key?: string): boolean;

  /**
   * 获取真实valid
   * 由于hidden的字段也检验这里排除有hidden字段的列
   * 当表单配置列为空时，因使用every处理默认返回true
   */
  getRealValid(): boolean;
}
