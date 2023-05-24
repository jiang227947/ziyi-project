import {ChatChannelsMessageTypeEnum} from '../enum/chat-channels.enum';

/**
 * 单独聊天频道接口
 */
export interface PrivateChatChannelsInterface {
  // 消息发起人信息
  from: ChatFromInterface;
  // 消息接收人信息
  to: ChatToInterface;
  // 内容
  content: string;
  // 消息类型
  type: string;
  // 发送时间
  time: number;
}

/**
 * 群体聊天频道接口
 */
export interface RoomChatChannelsInterface {
  // 消息发起人信息
  from: ChatFromInterface;
  // 消息接收信息
  to: ChatToRoomInterface;
  // 内容
  content: string;
  // 消息类型
  type: ChatChannelsMessageTypeEnum;
  // 发送时间
  time: number;
}

/**
 * 消息发起人信息
 */
export interface ChatFromInterface {
  // 发起人名称
  userName: string;
  // 发起人ID
  id: string;
}

/**
 * 消息接收人信息
 */
export interface ChatToInterface {
  // 接收人名称
  userName: string;
  // 接收人ID
  id: string;
  // 接收人socketId
  socketId: string;
}

/**
 * 消息接收群信息
 */
export interface ChatToRoomInterface {
  // roomId
  roomId: string;
  // 房间名
  roomName: string;
}

/**
 * 聊天频道聊天频道房间接口
 */
export interface ChatChannelRoomInterface {
  // 房间ID
  roomId: string;
  // 房间名称
  roomName: string;
  // 用户信息
  users: {
    // id
    id: number;
    // socketId
    socketId: string;
    // 名称
    name: string;
    // 头像
    avatar?: string;
  }[]
}
