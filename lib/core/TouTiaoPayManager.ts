import crypto from 'crypto';;
import { IOptionsTouTiao, IRequestTouTiaoPrepayParams } from "../../types";
import { Logger } from "../logger";
import { PayManager } from "./PayManager";
import { TT_PAY_API_URL } from '../constants';
import bent from 'bent';

// 微信支付v3
export class TouTiaoPayManager extends PayManager {
  private logger: Logger;
  private options: IOptionsTouTiao;
  private httpPost = bent(TT_PAY_API_URL, 'POST', 'json', 200);
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
      str = `[${value.map(item => this.valueToString(item)).join(' ')}]`
    } else if (typeof value === 'object') {
      str = `map[${Object.keys(value).map(mapKey => {
        return `${mapKey}:${this.valueToString(value[mapKey])}`
      }).join(' ')}]`
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
    const sign = _md5.digest('hex');
    console.log('签名：', sign);
    return sign;
  }
  async postRequest(url: string, body?: Record<string, any>) {
    try {
      const response = await this.httpPost(url, body, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
      this.logger.log('头条支付POST请求结果：', response);
      return response;
    } catch (error: any) {
      const json = await error.json?.();
      this.logger.error('头条支付POST请求失败：', json);
      throw error;
    }
  }
  async prepay(params: IRequestTouTiaoPrepayParams) {
    const {channel, ...rest} = params;
    console.log(rest);
    const sign = this.getSignature(rest);
    const body = {
      ...rest,
      app_id: this.options.appId,
      sign,
    }
    const res = await this.postRequest('/api/apps/ecpay/v1/create_order', body);
    this.logger.log('头条支付预下单结果：', res);
    
    return {
      order_id: sign,
    }
  }
  decryptCallback() {
    
  }
}