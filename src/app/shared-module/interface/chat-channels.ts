import {
  ChatChannelsMessageStatesEnum, ChatChannelsMessageTypeEnum,
  ChatMessagesTypeEnum, SystemMessagesEnum
} from '../enum/chat-channels.enum';


/**
 * 聊天频道订阅接口
 */
export interface ChatChannelSubscribeInterface {
  type: ChatChannelsMessageTypeEnum;
  msg: ChatChannelRoomInterface | ChatChannelSystemStatesUserInterface | any;
}

/**
 * 聊天频道聊天频道房间接口
 */
export interface ChatChannelRoomInterface {
  // 消息类型
  systemStates: SystemMessagesEnum;
  // 房间ID
  roomId: string;
  // 房间名称
  roomName: string;
  // 公告
  announcement: string;
  // 频道人员
  personnel: string | ChatChannelRoomUserInterface[];
  // 用户信息
  users: ChatChannelRoomUserInterface[];
}

/**
 * 聊天频道聊天频道在线用户接口
 */
export interface ChatChannelRoomUserInterface {
  // id
  id: number;
  // socketId
  socketId: string;
  // 名称
  userName: string;
  // 头像
  avatar: string;
  // 颜色
  color: string;
  // 邮箱
  email: string;
  // 备注
  remarks: string;
  // 角色
  role: string;
  // 角色名称
  roleName: string;
  // 在线状态
  status: number;
  // 最后登录时间
  lastOnline: number;
}

/**
 * 系统消息用户状态
 */
export interface ChatChannelSystemStatesUserInterface {
  // 消息类型
  systemStates: SystemMessagesEnum;
  // 用户名称
  userName: string;
}

/**
 * 消息接口
 */
export interface ChatMessagesInterface {
  // 附件
  attachments: ChatAttachmentsInterface | string;
  // 作者
  author: ChatSendAuthorInterface;
  // 频道id
  channelId: string;
  // 组件
  components: any[];
  // 消息内容
  content: string;
  // 编辑消息的时间
  edited_timestamp: string;
  // 反应
  reaction: {
    emoji: string,
    count: number,
    user: number[]
  }[];
  // 标志
  flags: number;
  // 提及的人
  mention_everyone: boolean;
  // 提及的人名称信息
  mentions: ChatChannelRoomUserInterface;
  // 留言参考
  messageReference: ChatSendAuthorInterface;
  // 参考消息
  referencedMessage: any;
  // 固定
  pinned: boolean;
  // 时间
  timestamp: string;
  // 文本转语音
  tts: boolean;
  // 消息类型 用于前端展示判断
  type: ChatMessagesTypeEnum;
  // 系统消息类型枚举
  systemStates?: SystemMessagesEnum;
  // 消息发送状态
  states?: ChatChannelsMessageStatesEnum;
}

/**
 * 消息发送方
 */
export interface ChatSendAuthorInterface {
  // 头像
  avatar: string;
  // 头像描述
  avatar_decoration: string;
  // 鉴别器
  discriminator: string;
  // 全局名称
  global_name: string;
  // id
  id: number;
  // 公共标签
  public_flags: number;
  // 用户名
  userName: string;
}

/**
 * 查询的聊天记录接口
 */
export interface QueryMessagesList {
  // 消息体
  content: string;
  // id
  id: number;
  // 保存时间
  saveTime: number;
}

/**
 * 操作类的接口
 */
export interface ChatOperateInterface {
  // 在线用户弹框
  isCollapsed: boolean;
  // 我的设置弹框
  mySetting: boolean;
  // 标注消息弹框
  pushpin: boolean;
  // emoji弹框
  emoji: boolean;
  // 添加反应emoji弹框
  reactionEmoji: boolean;
  // 当前选择的消息
  selectMsgIdx: number;
  // 文件弹框
  fileUpload: boolean;
}

/**
 * 消息类
 */
export class ChatMessagesModal {
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
    id: number;
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
  // 反应
  reaction: any[];
  // 标志
  flags: number;
  // 提及的人
  mention_everyone: boolean;
  // 提及的人名称信息
  mentions: ChatChannelRoomUserInterface;
  // 留言参考
  messageReference: any[];
  // 引用消息
  referencedMessage: any[];
  // 固定
  pinned: boolean;
  // 时间
  timestamp: string;
  // 文本转语音
  tts: boolean;
  // 消息类型 用于前端展示判断
  type: ChatMessagesTypeEnum;
  // 系统消息类型枚举
  systemStates?: SystemMessagesEnum;
  // 消息发送状态
  states?: ChatChannelsMessageStatesEnum;
}

/**
 * 创建频道的参数接口
 */
export interface CreateChannelParamInterface {
  // 频道ID
  channelId?: string;
  // 头像
  avatar: string;
  // 名称
  channelName: string;
  // 标签
  tags: string | string[];
  // 管理员
  admins: string | number[];
  // 是否私密
  isPrivacy: number | boolean;
  // 密码
  password: string;
  // 公告
  announcement: string;
  // 备注
  remark: string;
}

/**
 * 聊天附件接口
 */
export interface ChatAttachmentsInterface {
  // 路径
  path: string;
  // 名称
  name: string;
  // 大小
  size: number;
  // 类型
  type: string;
  // 类型
  fileType: string;
  // 时间
  date: number;
}
