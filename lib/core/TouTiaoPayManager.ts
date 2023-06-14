import crypto from 'crypto';;
import { IOptionsTouTiao, IRequestTouTiaoPrepayParams } from "../../types";
import { Logger } from "../logger";
import { PayManager } from "./PayManager";

// 微信支付v3
export class TouTiaoPayManager extends PayManager {
  private logger: Logger;
  private options: IOptionsTouTiao;
  private requestNotNeedSignParams = ['app_id', 'sign', 'thirdparty_id','other_settle_params'];
  constructor(options: IOptionsTouTiao, logger: Logger) {
    super();
    this.logger = logger;
    this.options = options;
  }
  
  private valueToString(value: any): string {
    if (value===null || value === undefined) {
      return '';
    }
    let str = '';
    
    if (['string', 'number'].includes(typeof value)) {
      str = String(value);
    }
    if (Array.isArray(value)) {
      console.log('数组');
      console.log(value);
      str = `[${value.map(item => this.valueToString(item)).join(' ')}]`
    }
    if (typeof value === 'object') {
      str = `map[${Object.values(value).map(item => this.valueToString(item)).join(' ')}]`
    }
    return str.trim();
  }
  private getSignature(params: Record<string, any>) {
    if (!this.options.salt) {
      this.logger.error('请检查您的配置，salt不能为空');
      throw new Error('toutiao pay config salt missed');
    }
    const strForSign = Object.keys(params)
    .filter(key => !this.requestNotNeedSignParams.includes(key))
    .map(key => this.valueToString(params[key]))
    .filter(val => val !== '')
    .concat(this.options.salt)
    .sort()
    .join('&');

    this.logger.log('待签串:', strForSign);
    
    const _md5 = crypto.createHash('md5');
    _md5.update(strForSign);
    return _md5.digest('hex');
  }
  async prepay(params: IRequestTouTiaoPrepayParams) {
    const sign = this.getSignature(params);
    return {
      order_id: sign,
    }
  }
  decryptCallback() {
    
  }
}