/**
 * 文件接口
 */
export interface File {
  id: number; // id
  filename: string; // 文件名
  filesize: number; // 文件大小
  filePath: string; // 文件地址
  createdAt: number; // 上传时间
  percent?: number; // 下载进度
}
