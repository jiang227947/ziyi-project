import {decipher, encipher} from './encipher';


/**
 * 加密、存储数据到localStorage
 * param key
 * param value
 */
export function setLocalStorage(key, value): void {
  const cipher = encipher(value);
  localStorage.setItem(key, cipher);
}

/**
 * 获取localStorage、解密
 * 不加JSON.parse 可用于获取字符串数据
 * param key
 * returns {*}
 */
export function getLocalStorage(key): string {
  if (localStorage.getItem(key) && localStorage.getItem(key) !== 'undefined') {
    const cipher = localStorage.getItem(key);
    return decipher(cipher);
  } else {
    return null;
  }
}

/**
 * 获取JSON数据的localStorage、解密
 * param key
 * returns {*}
 */
export function getJSONLocalStorage(key): string {
  return JSON.parse(getLocalStorage(key));
}


