import { IOptionsWechat, IWechatPrepayParams } from "../../types";
import { Logger } from "../logger";
import { PayManager } from "./PayManager";

// 微信支付v3
export class WechatPayManager extends PayManager {
  private logger: Logger;
  private options: IOptionsWechat;
  constructor(options: IOptionsWechat, logger: Logger) {
    super();
    this.logger = logger;
    this.options = options;
  }
  pay(params: IWechatPrepayParams) {
    console.log(params);
  }
}