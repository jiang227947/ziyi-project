import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormItem} from './form-config';
import {FormOperate} from './form-operate.service';
import * as lodash from 'lodash';
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzI18nService} from "ng-zorro-antd/i18n";

const FORM = 'form';

/**
 * 表单组件
 */
@Component({
  selector: 'zy-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  // 表单配置
  @Input() column: FormItem[];
  // formGroup
  public formGroup = new FormGroup({});
  // 是否禁用
  @Input() isDisabled: boolean;
  // 表单实例
  @Output() formInstance = new EventEmitter<{ instance: FormOperate }>();
  // 输入框的组件实列
  @ViewChild('inputNumber') inputNumberComp: NzInputNumberComponent;
  // 表单语言包
  public language: any;
  // 对于输入框输入完之后去除前后空格
  public inputDebounce = lodash.debounce((event, formGroup, col: FormItem) => {
    if (!col.notTrim) {
      event.target.value = event.target.value.trim();
      Promise.resolve().then(() => {
        formGroup.controls[col.key].setValue(event.target.value);
        formGroup.updateValueAndValidity();
      });
    }
  }, 500, {leading: false, trailing: true});
  // 表单操作实例
  private formOperate: FormOperate;

  constructor(private $i18n: NzI18nService) {
    this.language = this.$i18n.getLocaleData(FORM);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.column) {
      this.initForm();
    }
  }

  ngOnDestroy(): void {
    this.inputNumberComp = null;
  }

  ngAfterViewInit(): void {
    if (this.inputNumberComp) {
      this.inputNumberComp.onModelChange = (value: string) => {
        this.inputNumberComp['actualValue'] = this.inputNumberComp.nzParser(value.trim().replace(/。/g, '.').replace(/[^\w\.-]+/g, ''));
        this.inputNumberComp.inputElement.nativeElement.value = this.inputNumberComp['actualValue'];
        this.inputNumberComp.setValue(Number(this.inputNumberComp.inputElement.nativeElement.value));
      };
    }
  }

  /**
   * 表单值变化
   * param controls
   * param $event
   * param col
   */
  public modelChange(controls: any, $event, col: FormItem): void {
    if (col.inputType === 'password') {
      const node = document.getElementById(col.key);
      node.setAttribute('type', 'password');
    }
    if (col.modelChange) {
      col.modelChange(controls, $event, col.key);
    }
  }

  /**
   * 展开回调
   * param controls
   * param $event
   * param col
   */
  public openChange(controls: any, $event: boolean, col: FormItem): void {
    if (col.openChange) {
      col.openChange(controls, $event, col.key, this.column);
    }
  }

  /**
   * 初始化表单配置
   */
  private initForm(): void {
    this.formGroup = new FormGroup({});
    this.formOperate = new FormOperate(this.formGroup, this.column, this.language);
    this.column.forEach((item: FormItem) => {
      const value = item.initialValue;
      const formControl = new FormControl({value: value, disabled: this.isDisabled || item.disabled},
        this.formOperate.addRule(item.rule, item.customRules),
        this.formOperate.addAsyncRule(item.asyncRules));
      this.formGroup.addControl(item.key, formControl);
    });
    this.formInstance.emit({instance: this.formOperate});
  }
}
