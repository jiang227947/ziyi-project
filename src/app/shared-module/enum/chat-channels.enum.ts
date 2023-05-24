/**
 * 聊天频道消息类型
 */
export enum ChatChannelsMessageTypeEnum {
// 一般消息
  generalMessage = 'generalMessage',
  // 房间消息
  roomMessage = 'roomMessage',
  // 全体消息
  allMessage = 'allMessage',
  // 系统消息
  systemMessage = 'systemMessage'
}

/**
 * 聊天频道回调
 */
export enum ChatChannelsCallbackEnum {
  // 成功
  ok = 'ok',
  // 失败
  error = 'error'
}
