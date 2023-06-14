export interface IOptionsWechat {
  /**
   * 微信小程序appId
   */
  appId: string;
  /**
   * 商户号
   */
  mchId: string;
  /**
   * 密钥内容字符串或buffer
   * 和privateKeyPath二选一
   */
  privateKey?: string | Buffer;
  /**
   * 密钥文件路径
   * 和privateKey二选一
   */
  privateKeyPath?: string;

  /**
   * 公钥内容字符串或buffer
   * 和publicKeyPath二选一
   */
  publicKey?: string | Buffer;

  /**
   * 公钥文件路径
   * 和publicKey二选一
   */
  publicKeyPath?: string;

  /**
   * 证书序列号， 如未配置，会根据公钥自动获取
   */
  serialNo?: string;
  
  /**
   * apiKey v3
   * 详见 https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay3_2.shtml
   */
  apiKeyV3?: string;
}


// 微信支付，预支付参数，见 https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_1.shtml
export interface IWechatPrepayParams {
  appId?: string; // 可选是因为可以从全局配置中获取
  mchid?: string; // 可选是因为可以从全局配置中获取
  description: string;
  out_trade_no: string;
  time_expire?: string;
  attach?: string;
  notify_url: string;
  goods_tag?: string;
  support_fapiao?: boolean;
  amount: {
    total: number;
    currency: string;
  };
  payer: {
    openid: string;
  };
  detail?: {
    cost_price?: number;
    invoice_id?: string;
    goods_detail: {
      merchant_goods_id: string;
      wechatpay_goods_id?: string;
      goods_name?: string;
      quantity: number;
      unit_price: number;
    }[];
  };
  scene_info?: {
    device_id?: string;
    payer_client_ip: string;
    store_info?: {
      id: string;
      name?: string;
      area_code?: string;
      address?: string;
    };
  };
  settle_info?: {
    profit_sharing?: boolean;
  };
}


// 微信支付，预支付结果
export interface IWechatPrepayResult {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}