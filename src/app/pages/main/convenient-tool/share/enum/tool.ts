/**
 * 进制数转换枚举
 */
export enum RadixEnum {
  // 符号位十六进制转十进制
  _HEXtoDec = 0,
  // 十六进制转十进制
  HEXtoDec = 1,
  // 十六进制转八进制
  HEXtoOct = 2,
  // 十六进制转二进制
  HEXtoBin = 3,
  // 十进制转十六进制
  DECtoHex = 4,
  // 十进制转八进制
  DECtoOct = 5,
  // 十进制转二进制
  DECtoBin = 6,
  // 八进制转十六进制
  OCTtoHex = 7,
  // 八进制转十进制
  OCTtoDec = 8,
  // 八进制转二进制
  OCTtoBin = 9,
  // 二进制转十六进制
  BINtoHex = 10,
  // 二进制转十进制
  BINtoDec = 11,
  // 二进制转八进制
  BINtoOct = 12
}
