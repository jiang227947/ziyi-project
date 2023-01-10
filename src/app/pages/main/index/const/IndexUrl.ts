/**
 * index请求地址
 * */
export const IndexUrl = {
  // 获取指定日期的节假日信息
  holidayInfo: `https://timor.tech/api/holiday/info`,
  // 计算下一个假期
  holidayNext: `https://timor.tech/api/holiday/next/$date`,
  // 获取指定日期的下一个工作日（工作日包含正常工作日、调休）不包含当天
  holidayWorkdayNext: `https://timor.tech/api/holiday/workday/next/$date`,
  // 返回文字。距离今天最近的一个放假安排。周六周末、调休、节假日都会考虑，比较全面的放假安排。
  holidayTts: `https://timor.tech/api/holiday/tts`,
  // 返回文字。回答明天放假吗。
  holidayTtsTomorrow: `https://timor.tech/api/holiday/tts/tomorrow`,
};
