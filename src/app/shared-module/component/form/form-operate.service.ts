/**
 * Created by jzy
 */
import {AsyncValidatorFn, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FormItem, Rule} from './form-config';
import {FormOperateInterface} from './form-operate.interface';

/**
 * 表单操作实现类
 */
export class FormOperate implements FormOperateInterface {

  group: UntypedFormGroup;
  column: FormItem[];
  language;

  constructor(group, column, language) {
    this.group = group;
    this.column = column;
    this.language = language;
  }

  public static createColumnTemp(data: any, configTable?): FormItem[] {
    const arr = [];
    data.forEach((item, index) => {
      const formItem = new FormItem();
      formItem.key = item.id;
      formItem.type = item.type;
      formItem.label = item.name;
      if (item.unit) {
        // formItem.suffix = item.unit;
        formItem.label = item.name + '(' + item.unit + ')';
      }
      formItem.labelWidth = item.labelWidth || 170;
      formItem.col = item.col || 12;
      formItem.disabled = !item.display;
      formItem.initialValue = item.defaultValue;
      formItem.require = item.rules && item.rules.some(_item => _item.required);
      formItem.rule = item.rules || [];
      if (item.placeholder) {
        formItem.placeholder = item.placeholder;
      }
      if (formItem.type === 'select') {
        formItem.selectInfo = {
          data: item.selectParams,
          label: 'name',
          value: 'id',
        };
      }
      if (formItem.type === 'table') {
        formItem.type = 'custom';
        if (item.id === 'singleConfig') {
          formItem.template = configTable;
        }
        formItem.col = 24;
        formItem.labelWidth = 0;
      }
      arr.push(formItem);
    });
    return arr;

  }

  createColumn(data): void {
  }

  public addColumn(formItem: FormItem, _index?: number): void {
    const index = this.getColumn(formItem.key).index;
    if (index === -1) {
      const validator = this.addRule(formItem.rule);
      const asyncValidator = this.addAsyncRule(formItem.asyncRules);
      const formControl = new UntypedFormControl(formItem.initialValue || '', validator, asyncValidator);
      this.group.registerControl(formItem.key, formControl);
      if (_index && _index !== 0) {
        this.column.splice(_index, 0, formItem);
      } else {
        this.column.push(formItem);
      }
    }
  }

  public deleteColumn(key): void {
    const index = this.getColumn(key).index;
    if (index !== -1) {
      this.column.splice(index, 1);
      this.group.removeControl(key);
    }
  }

  public getColumn(key): { index: number, item?: FormItem } {
    const index = this.column.findIndex(item => item.key === key);
    if (index !== -1) {
      return {index: index, item: this.column[index]};

    } else {
      return {index: index};
    }
  }

  public setColumnHidden(keys: string[], value: boolean): void {
    this.column.forEach(item => {
      if (keys.includes(item.key)) {
        item.hidden = value;
      }
    });
  }

  public addValidRule(formItem: FormItem): void {
    const validator = this.addRule(formItem.rule);
    this.group.controls[formItem.key].setValidators(validator);
  }

  public deleteValidRule(formItem: FormItem): void {
    this.group.controls[formItem.key].clearValidators();
    this.deleteRule(formItem);
  }

  public addRule(rule: Rule[], customRules?: any[]): ValidatorFn[] {
    const validator = [];
    // angular 内建检验规则
    if (rule) {
      rule.forEach(item => {
        if (item.hasOwnProperty('required')) {
          validator.push(Validators.required);
          item.msg = item.msg || this.language.requiredMsg;
          item.code = 'required';
        }
        if (item.hasOwnProperty('minLength')) {
          validator.push(Validators.minLength(item.minLength));
          item.msg = item.msg || `${this.language.minLengthMsg}${item.minLength}${this.language.count}`;
          item.code = 'minlength';
        }
        if (item.hasOwnProperty('maxLength')) {
          validator.push(Validators.maxLength(item.maxLength));
          item.msg = item.msg || `${this.language.maxLengthMsg}${item.maxLength}${this.language.count}`;
          item.code = 'maxlength';
        }
        if (item.hasOwnProperty('min')) {
          item.code = 'min';
          item.msg = item.msg || `${this.language.minMsg}${item.min}${this.language.exclamation}`;
          validator.push(Validators.min(item.min));
        }
        if (item.hasOwnProperty('max')) {
          item.code = 'max';
          item.msg = item.msg || `${this.language.maxMsg}${item.max}${this.language.exclamation}`;
          validator.push(Validators.max(item.max));
        }
        if (item.hasOwnProperty('email')) {
          item.code = 'email';
          item.msg = item.msg || this.language.emailMsg;
          validator.push(Validators.email);
        }
        if (item.hasOwnProperty('pattern')) {
          item.code = 'pattern';
          item.msg = item.msg || this.language.patternMsg;
          validator.push(Validators.pattern(new RegExp(item.pattern)));
        }
      });
    }
    // 添加自定义校验规则
    if (customRules && customRules.length > 0) {
      customRules.forEach(_item => {
        validator.push(_item.validator);
      });
    }

    return validator;
  }


  public addAsyncRule(rules: { asyncRule: AsyncValidatorFn, asyncCode: any }[]): AsyncValidatorFn[] {
    const control = [];
    if (rules) {
      rules.forEach((rule) => {
        control.push(rule.asyncRule);
      });
    }
    return control;
  }

  public deleteRule(formItem: FormItem): void {
    formItem.rule = [];
  }

  public resetData(value?: any, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    this.group.reset(value, options);
  }

  public resetControlData(key: string, value?: any, options?: object): void {
    this.group.controls[key].reset(value, options);
  }

  public getData(key?: string): any {
    if (key) {
      return this.group.controls[key].value;
    } else {
      return this.group.value;
    }
  }

  public getRealData(): any {
    const formData = this.group.getRawValue();
    this.column.forEach(item => {
      if (item.hidden && formData[item.key]) {
        formData[item.key] = '';
      }
    });
    return formData;
  }

  public getValid(key?: string): boolean {
    if (key) {
      return this.group.controls[key].valid;
    } else {
      return this.group.valid;
    }
  }

  public getRealValid(): boolean {
    // 过滤掉禁用和隐藏的
    const column = this.column.filter(item => {
      if (item.hidden) {
        return false;
      } else {
        if (this.group.controls[item.key].enabled) {
          return true;
        }
      }
    });
    return column.every(_item => this.getValid(_item.key));
  }

}
