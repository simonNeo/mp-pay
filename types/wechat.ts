// 微信支付，预支付参数，见 https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_1.shtml
export interface IWechatPrepayP {
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