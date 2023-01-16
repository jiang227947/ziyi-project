import CryptoJS from 'crypto-js';

const config = {
  key: 'jiangziyiaeskeys',
  iv: 'abcdefghijklmnop'
};

const key = CryptoJS.enc.Utf8.parse(config.key); // 16位
const iv = CryptoJS.enc.Utf8.parse(config.iv);
const dataConst = {
  iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
};

/**
 * aes加密
 * param word
 * returns {string}
 */
export function encipher(word): string {
  let encrypted: any = '';
  if (typeof word === 'string') {
    const source = CryptoJS.enc.Utf8.parse(word);
    encrypted = CryptoJS.AES.encrypt(source, key, dataConst);
  } else if (typeof word === 'object') {
    // 对象格式的转成json字符串
    const data = JSON.stringify(word);
    const source = CryptoJS.enc.Utf8.parse(data);
    encrypted = CryptoJS.AES.encrypt(source, key, dataConst);
  }
  return encrypted.ciphertext.toString();
}


/**
 * aes解密
 * param word
 * returns {string}
 */
export function decipher(word): string {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const source = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(source, key, dataConst);
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}


/**
 * md5加密
 * param  str
 */
export function md5(str): string {
  return CryptoJS.MD5(str).toString(CryptoJS.enc.Hex);
}


/**
 * sha1加密
 * param str
 */
export function sha1(str): string {
  return CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex);
}
