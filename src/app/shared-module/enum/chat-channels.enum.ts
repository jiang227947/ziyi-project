/**
 * 聊天频道消息类型
 */
export enum ChatChannelsMessageTypeEnum {
    // 公共频道消息
    publicMessage = 'publicMessage',
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

/**
 * 消息发送状态
 */
export enum ChatChannelsMessageStatesEnum {
    // 成功
    success = 'success',
    // 发送中
    loading = 'loading',
    // 发送失败
    error = 'error'
}

/**
 * 消息类型枚举
 */
export enum ChatMessagesTypeEnum {
    // 一般消息
    general = 0,
    // 连续消息
    continuous = 1,
    // 系统消息
    system = 2
}

/**
 * 系统消息类型枚举
 */
export enum SystemMessagesEnum {
    // 房间信息
    roomInfo = 'roomInfo',
    // 用户加入
    join = 'userJoin',
    // 用户离开
    left = 'userLeft'
}
