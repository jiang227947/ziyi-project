// 地图类型
export enum EMapType {
  // 谷歌IT
  google = 'google',
  // 高德地图
  aMap = 'aMap',
  // 百度地图
  bMap = 'bMap'
}

// 加载状态
export enum EMapLoadTypeStatus {
  // 加载中
  loading = 'loading',
  // 加载成功
  done = 'done',
  // 加载失败
  error = 'error'
}
