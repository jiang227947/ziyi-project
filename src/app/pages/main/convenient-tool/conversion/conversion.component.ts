import {Component, OnInit} from '@angular/core';
import {RadixEnum} from '../share/enum/tool';
import {_radixConversionOption, _radixConversionType} from '../share/const/radixConversion.const';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss']
})
export class ConversionComponent implements OnInit {

  // 进制转换类型
  radixConversionType: RadixEnum = _radixConversionType;
  // 进制转换选项
  radixConversionOption: { label: string, value: RadixEnum }[] = _radixConversionOption;
  // 被转换的值
  buffer: string;
  // 转换后的值
  radixValue: string | number;
  // 折线图实例
  lineChartInstance: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  // 进制转换
  radixConversion(): void {
    let result: string | number;
    switch (this.radixConversionType) {
      case RadixEnum._HEXtoDec:
        result = this.hexadecimalToDecimalConverter(this.buffer);
        break;
      case RadixEnum.HEXtoDec:
        result = parseInt(this.buffer, 16);
        break;
      case RadixEnum.HEXtoOct:
        result = parseInt(this.buffer, 16).toString(8);
        break;
      case RadixEnum.HEXtoBin:
        result = parseInt(this.buffer, 16).toString(2);
        break;
      case RadixEnum.DECtoHex:
        result = parseInt(this.buffer, 16);
        break;
      case RadixEnum.DECtoOct:
        result = parseInt(this.buffer).toString(8);
        break;
      case RadixEnum.DECtoBin:
        result = parseInt(this.buffer).toString(2);
        break;
      case RadixEnum.OCTtoHex:
        result = parseInt(this.buffer, 8).toString(16);
        break;
      case RadixEnum.OCTtoDec:
        result = parseInt(this.buffer, 8);
        break;
      case RadixEnum.OCTtoBin:
        result = parseInt(this.buffer).toString(2);
        break;
      case RadixEnum.BINtoHex:
        result = parseInt(this.buffer, 2).toString(16);
        break;
      case RadixEnum.BINtoDec:
        result = parseInt(this.buffer, 2);
        break;
      case RadixEnum.BINtoOct:
        result = parseInt(this.buffer, 2).toString(8);
        break;
      default:
        break;
    }
    this.radixValue = result;
  }

  // 符号位十六进制转十进制
  hexadecimalToDecimalConverter(num: string): string {
    let result;
    // 十六进制转二进制
    let jz2 = parseInt(`${num}`, 16).toString(2);
    // console.log('十六进制转二进制', jz2, jz2[1]);
    let fan = '';
    // 长度不够16补0
    if (jz2.length < 16) {
      for (let i = 0; i < 16 - jz2.length; i++) {
        jz2 = `0${jz2}`;
      }
    }
    // 判断为正数还是负数 负数则开始原反补
    if (jz2[0] === '1') {
      // 去掉第一位符号位
      const yuan = jz2.slice(1, jz2.length);
      // console.log('去掉第一位符号位', jz2);
      // 循环反码
      for (let i = 0; i < yuan.length; i++) {
        if (yuan[i] === '0') {
          fan = `${fan}1`;
        } else {
          fan = `${fan}0`;
        }
      }
      // 去掉的符号位补0
      fan = `0${fan}`;
      if (num === '71D1') {
        console.log('去掉的符号位补0', parseInt(fan, 2));
      }
      // console.log('去掉的符号位补0', fan);
      // result = -parseInt(fan, 2) - 1;
      result = ((0.001470 * (-parseInt(fan, 2) - 1)) - 12.640910).toFixed(5);
    } else {
      // result = parseInt(num, 16);
      result = ((0.001470 * parseInt(num, 16)) - 12.640910).toFixed(5);
    }
    return result;
  }

  /**
   * 获取折线图实例
   */
  getLineChartInstance(event): void {
    this.lineChartInstance = event;
  }
}
