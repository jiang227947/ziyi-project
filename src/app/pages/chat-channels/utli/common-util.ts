/**
 * 聊天的工具类
 */
export class ChatCommonUtil {

  /**
   * 添加反应表情
   * @param list 反应数组
   * @param emoji 表情
   * @param id 用户id
   */
  public static addReaction(list: { emoji: string, count: number, user: number[] }[], emoji: string, id: number): any[] {
    const reactionList = [];
    for (let i = 0; i < list.length; i++) {
      reactionList.push(list[i].emoji);
    }
    const isIndex = reactionList.indexOf(emoji);
    // 判断反应是否存在
    if (isIndex >= 0) {
      const isId = list[isIndex].user.indexOf(id);
      // 判断用户是否添加过反应
      if (isId < 0) {
        list[isIndex].user.push(id);
        list[isIndex].count++;
      } else {
        list[isIndex].user.splice(isId, 1);
        // 判断是否为最后一个表情
        if (list[isIndex].count === 1) {
          list.splice(isIndex, 1);
        } else {
          list[isIndex].count--;
        }
      }
    } else {
      // 没有反应直接新增
      list.push({
        emoji,
        count: 1,
        user: [id]
      });
    }
    return list;
  }

  /**
   * 删除反应表情
   * @param list 反应数组
   * @param emoji 表情
   */
  public static deleteReaction(list: any[], emoji: string): void {
    for (let i = 0; i < list.length; i++) {
      if (list[i].emoji === emoji) {
        list[i].count -= 1;
      }
    }
  }
}
