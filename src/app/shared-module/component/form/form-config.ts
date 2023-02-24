/**
 * Created by jzy
 */
import {AbstractControl} from '@angular/forms';
import {NzTreeNode} from "ng-zorro-antd/tree";

/**
 * 表单配置类
 */
export class FormItem {
  label: string; // label;
  key: string; // 表单字段
  type: string; // 表单类型
  inputType?: string; // 输入框类型
  width?: number;  //  表单主体的宽度
  labelWidth?: number;  // 表单label的宽度
  labelHeight?: number; // 表单属性高度
  col?: number; // 在一行的占比 一行为24份 不填默认12
  require?: boolean; // 是否有必填星号
  initialValue?: any; // 初始值
  rule: any[];    // 同步校验规则
  asyncRules?: any[]; // 异步校验规则
  customRules?: CustomRule[]; // 自定义校验规则
  selectInfo?: any;  // 选择框（包括单选 多选 下拉选择 ）选项数据
  selectType?: string; // 'multiple'丨'tags'丨'default'下拉选择框类型不填默认为单选
  radioInfo?: any;
  modelChange?: (controls, $event, key, formOperate?) => void;   // 数据变化函数
  openChange?: (controls, $event, key, formOperate?) => void;   // 为下拉框的时候 展开函数
  openContent?: string; // 切换器开的时候显示内容
  closeContent?: string; // 切换器关的时候显示内容,
  disabled?: boolean;
  allowClear?: boolean; // 下拉选择器 清除按钮
  template?: any; // 当表单类型为自定义的时候
  defaultExpandKeys?: any[]; // 树选择器默认展开项
  treeSelectNodes?: NzTreeNode[]; // 树选择器节点
  placeholder?: string; // placeholder
  suffix?: string; // 后缀如单位等
  title?: string; // 每个表单上面的标题
  hidden?: boolean; // 隐藏
  notTrim?: boolean; // 是否前后去空格
  timePickerWidth?: string; // 时间选择器宽度样式
  showTime?: boolean; // 时间选择器是否显示时间
}

/**
 * 默认规则
 */
export class Rule {

  required?: boolean; // 是否为必填
  minLength?: number;  // 最小长度
  maxLength?: number;  // 最大长度
  min?: number; // 最小值
  max?: number; // 最大值
  pattern?: RegExp;
  msg?: string;    // 错误信息
  code?: string;  // 响应式表单显示错误代码
  customValidator?: any;
}

/**
 * 自定义规则
 */
export class CustomRule {
  code: string;
  msg: string;
  validator: (control: AbstractControl) => { [key: string]: boolean };
}
