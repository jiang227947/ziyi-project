/**
 * 规则服务类
 */
export class RuleUtil {
  static getNameMinLengthRule(): { minLength: number } {
    return {minLength: 1};
  }

  static getNameMaxLengthRule(length = 32): { maxLength: number } {
    return {maxLength: length};
  }

  static getMaxLength20Rule(): { maxLength: number } {
    return {maxLength: 20};
  }

  static getMaxLength40Rule(): { maxLength: number } {
    return {maxLength: 40};
  }

  /**
   * 只能输入中英文，数字，中横线、下划线或空格组合,且不能以？！_开头
   */
  static getAlarmNamePatternRule(msg = null): { pattern: string, msg?: any } {
    if (msg) {
      return {pattern: '^(?!_)[a-zA-Z0-9-_\u4e00-\u9fa5\\s]+$', msg};
    } else {
      return {pattern: '^(?!_)[a-zA-Z0-9-_\u4e00-\u9fa5\\s]+$'};
    }
  }

  /**
   * 只能输入中英文，数字
   */
  static getNamePatternRule(msg = null): { pattern: string, msg?: any } {
    if (msg) {
      return {pattern: '^(?!_)[a-zA-Z0-9\u4e00-\u9fa5\\s]+$', msg};
    } else {
      return {pattern: '^(?!_)[a-zA-Z0-9\u4e00-\u9fa5\\s]+$'};
    }
  }

  /**
   * 只能英文数字和下划线和中横线
   */
  static getCodeRule(msg = null): { pattern: string, msg?: any } {
    if (msg) {
      return {pattern: '^[A-Za-z0-9-_.]+$', msg};
    } else {
      return {pattern: '^[A-Za-z0-9-_.]+$'};
    }
  }

  /**
   * 邮箱检验规则
   */
  static getMailRule(): { pattern: string, msg: string } {
    return {
      pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\\.[a-zA-Z0-9_-]+)+$',
      msg: '邮箱地址有误！'
    };
  }

  /**
   * 名称检验规则
   * returns {{pattern: string; msg: any}}
   */
  getNameRule(): { pattern: string, msg: string } {
    return {
      pattern: '^[\\s\\da-zA-Z\u4e00-\u9fa5`\\-=\\[\\]\\\\;\',./~!@#$%^&*\\(\\)_+{}|:"<>?·【】、；\'、‘’，。、！￥……（）——+｛｝：“”《》？]+$',
      msg: '只能输入中文、英文、数字、空格和常用符号！'
    };
  }
}
