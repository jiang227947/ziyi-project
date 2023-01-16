// import Compressor from 'compressorjs';

/**
 * 需要npm安装compressorjs，暂未用到，先不安装
 */
export class CompressUtil {

  /**
   * 压缩文件
   * @param file 文件对象
   */
  public static compressImg(file: any): Promise<File> {
    return new Promise((resolve, reject) => {
      /*new Compressor(
        file,
        {
          quality: 1024 * 1024 / file.size,
          convertSize: 1024 * 1024,
          success: (result: File) => {
            resolve(result);
          },
          error(error: Error) {
            reject(error);
          }
        }
      );*/
    });
  }
}
