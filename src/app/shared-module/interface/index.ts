/**
 * GTP返回的消息接口
 */
export interface GTPMessageInterface {
  choices: {
    message: {
      role: string, // 模型身份
      content: string // 模型返回给你的信息
    },
    finish_reason: string,
    index: number
  }[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: {
    [key: string]: number;
  };
}
