// 抖音小程序支付相关的类型定义

/**
 * 抖音小程序支付预下单接口参数
 * 详见： https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/server/ecpay/pay-list/pay
 */
export interface ITouTiaoPrepayParams {
  app_id?: string;
  out_order_no: string;
  total_amount: number;
  subject: string;
  body: string;
  valid_time: number;
  sign: string;
  cp_extra?: string;
  notify_url: string;
  thirdparty_id?: string;
  store_uid?: string;
  disable_msg?: number;
  msg_page?: string;
  expand_order_info?: {
    original_delivery_fee?: number;
    actual_delivery_fee: number;
  };
  limit_pay_way?: string;
}