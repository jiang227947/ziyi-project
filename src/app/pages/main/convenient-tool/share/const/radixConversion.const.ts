import {RadixEnum} from "../enum/tool";

/**
 * 进制转换选项
 */
export const _radixConversionOption: { label: string, value: RadixEnum }[] = [
  {
    label: '符号位十六进制转十进制',
    value: RadixEnum._HEXtoDec
  },
  {
    label: '十六进制转十进制',
    value: RadixEnum.HEXtoDec
  },
  {
    label: '十六进制转八进制',
    value: RadixEnum.HEXtoOct
  },
  {
    label: '十六进制转二进制',
    value: RadixEnum.HEXtoBin
  },
  {
    label: '十进制转十六进制',
    value: RadixEnum.DECtoHex
  },
  {
    label: '十进制转八进制',
    value: RadixEnum.DECtoOct
  },
  {
    label: '十进制转二进制',
    value: RadixEnum.DECtoBin
  },
  {
    label: '八进制转十六进制',
    value: RadixEnum.OCTtoHex
  },
  {
    label: '八进制转十进制',
    value: RadixEnum.OCTtoDec
  },
  {
    label: '八进制转二进制',
    value: RadixEnum.OCTtoBin
  },
  {
    label: '二进制转十六进制',
    value: RadixEnum.BINtoHex
  },
  {
    label: '二进制转十六进制',
    value: RadixEnum.BINtoDec
  },
  {
    label: '二进制转十六进制',
    value: RadixEnum.BINtoOct
  },
];

/**
 * 默认选项值
 */
export const _radixConversionType: RadixEnum = RadixEnum._HEXtoDec;
