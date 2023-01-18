/**
 * 文件接口
 */
export interface File {
  id: number; // id
  fileName: string; // 文件名
  fileSize: number; // 文件大小
  filePath: string; // 文件地址
  updateTime: number; // 上传时间
  percent?: number; // 下载进度
}
