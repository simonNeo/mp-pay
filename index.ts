import { PayManager } from "./lib/core/PayManager";
import { TouTiaoPayManager } from "./lib/core/TouTiaoPayManager";
import { WechatPayManager } from "./lib/core/WechatPayManager";
import { Logger } from "./lib/logger";
import { IOptions, TPrepayParams, TSupportedChannel } from "./types";

export class MpPay {
  private logger: Logger;
  private wechatPayManager: WechatPayManager | undefined;
  private touTiaoPayManager: TouTiaoPayManager | undefined;

  constructor(options: IOptions) {
    this.logger = new Logger(options?.logLevel || ['error', 'log', 'warn']);
    if (options.wx) {
      this.wechatPayManager = new WechatPayManager(options.wx, this.logger);
    }
    if (options.tt) {
      this.touTiaoPayManager = new TouTiaoPayManager(options.tt, this.logger);
    }
  }
  private getManager(channel: TSupportedChannel): PayManager {
    if (channel === 'wx') {
      if (!this.wechatPayManager) {
        this.logger.error('微信支付参数错误，请检查您的配置');
        throw new Error('wechat pay failed, please check your config');
      } else {
        return this.wechatPayManager;
      }
    }
    if (channel === 'tt') {
      if (!this.touTiaoPayManager) {
        this.logger.error('头条支付参数错误，请检查您的配置');
        throw new Error('toutiao pay failed, please check your config');
      } else {
        return this.touTiaoPayManager;
      }
    }
    this.logger.error('不支持的支付渠道');
    throw new Error('unsupported pay channel');
  }

  pay(params: TPrepayParams) {
    const manager = this.getManager(params.channel);
    return manager?.prepay(params);
  }

  decryptCallback(channel: TSupportedChannel, body: any) {
    const manager = this.getManager(channel);
    return manager?.decryptCallback(body);
  }
}