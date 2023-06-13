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
}