import bent from 'bent';

import { IOptionsWechat, IParams, IWechatPrepayParams, TSupportedMethod } from "../../types";
import { Logger } from "../logger";
import { PayManager } from "./PayManager";
import { WX_PAY_API_URL } from '../constants';
import { Util } from '../util';

// 微信支付v3
export class WechatPayManager extends PayManager {
  private logger: Logger;
  private options: IOptionsWechat;
  private post = bent(WX_PAY_API_URL, 'POST', 'json', 200);

  constructor(options: IOptionsWechat, logger: Logger) {
    super();
    this.logger = logger;
    this.options = options;
  }

  getAuthorization(method: TSupportedMethod, url: string, params?: IParams) {
    const nonceStr = Util.randomString(16);
    const timestamp = Util.timeStamp();
    // todo: 构造签名
  }
  pay(params: IWechatPrepayParams) {
    console.log(params);
  }
}