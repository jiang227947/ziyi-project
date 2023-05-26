import {ChatChannelsMessageTypeEnum, ChatMessagesTypeEnum} from '../enum/chat-channels.enum';

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
  }[];
}

/**
 * 消息接口
 */
export interface ChatMessagesInterface {
  // 附件
  attachments: any[];
  // 作者
  author: {
    // 头像
    avatar: string;
    // 头像描述
    avatar_decoration: string;
    // 鉴别器
    discriminator: string;
    // 全局名称
    global_name: string;
    // id
    id: string;
    // 公共标签
    public_flags: number;
    // 用户名
    username: string;
  };
  // 频道id
  channel_id: string;
  // 组件
  components: any[];
  // 消息内容
  content: string;
  // 编辑消息的时间
  edited_timestamp: string;
  // 嵌入
  embeds: any[];
  // 标志
  flags: number;
  // id
  id: string;
  // 提及的人
  mention_everyone: boolean;
  // 提及的角色
  mention_roles: any[];
  // 提及的人名称信息
  mentions: any[];
  // 留言参考
  message_reference: any[];
  // 参考消息
  referenced_message: any[];
  // 固定
  pinned: boolean;
  // 时间
  timestamp: string;
  // 文本转语音
  tts: boolean;
  // 类型
  type: ChatMessagesTypeEnum;
}
