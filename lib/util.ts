export class Util {
  private static randomFromTemplate(template: string, len: number) {
    const maxPos = template.length;
    let res = '';
    for (let i = 0; i < len; i++) {
      res += template.charAt(Math.floor(Math.random() * maxPos));
    }
    return res;
  }
  static randomString(len: number) {
    const template = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Util.randomFromTemplate(template, len);
  }
  
  /**
   * 获取时间戳，注意平台要求是10位（秒级）还是13位（毫秒级）
   * 默认type = s，返回秒级时间戳
   * @param type s: 秒级时间戳, ms: 毫秒级时间戳
   */
  static timestamp(type = 's' as 's' | 'ms') {
    const now = Date.now();
    if (type === 's') {
      return Math.floor(now / 1000);
    }
    return now;
  }
}