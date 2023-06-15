import bent from 'bent';
import crypto from 'crypto';

import { IRequestWechatPrepayParams, TSupportedMethods } from "../../types";
import { Logger } from "../logger";
import { PayManager } from "./PayManager";
import { WX_AUTHORIZATION_TYPE, WX_PAY_API_URL } from '../constants';
import { Util } from '../util';
import { IOptionsWechat } from '../../types/wechat';

// 微信支付v3
export class WechatPayManager extends PayManager {
  private logger: Logger;
  private options: IOptionsWechat;
  private httpPost = bent(WX_PAY_API_URL, 'POST', 'json', 200);
  // private httpGet = bent(WX_PAY_API_URL, 'GET', 'json', 200);

  constructor(options: IOptionsWechat, logger: Logger) {
    super();
    this.logger = logger;
    this.options = options;
  }

  /**
   * 获取私钥
   */
  private getPrivateKey(): string | Buffer {
    const { privateKey, privateKeyPath } = this.options;
    if (privateKey) {
      return privateKey;
    }
    if (privateKeyPath) {
      const buffer = this.readFile(privateKeyPath);
      this.options.privateKey = buffer;
      return buffer;
    }
    this.logger.error('微信支付私钥未配置, 请检查配置项privateKey或privateKeyPath');
    throw new Error('wechat pay private key missed');
  }

  /**
   * 获取微信签名
   * see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @param method 'POST' | 'GET' | 'PUT'
   * @param nonceStr 随机字符串
   * @param timestamp 时间戳
   * @param url /v3/xxx 如携带query参数，需要拼接生成完整url
   * @param body post请求的body，get请求的话传空，图片上传的话，传meta
   */
  private getSignature(method: TSupportedMethods, nonceStr: string, timestamp: string | number, url: string, body?: string | Record<string, any>) {
    let strForSign = `${method}\n${url}\n${timestamp}\n${nonceStr}\n`;
    if (body && typeof body === 'object') {
      body = JSON.stringify(body);
    }
    if (body) {
      strForSign += `${body}\n`;
    }
    this.logger.log('待签名：', strForSign);
    const sign = this.sha256WithRSA(strForSign);
    this.logger.log('签名：', sign);
    return sign;
  }

  /**
   * 使用商家私钥对字符串进行签名
   * @param str 待签名字符串
   * @returns base64编码的签名
   */
  private sha256WithRSA(str: string) {
    const key = this.getPrivateKey();
    return crypto.createSign('RSA-SHA256').update(str).sign(key, 'base64');
  }

  /**
   * 获取请求头Authorization
   */
  private getAuthorization(method: TSupportedMethods, url: string, body?: string | Record<string, any>) {
    const sn = this.getSerialNumber();
    const nonceStr = Util.randomString(16);
    const timestamp = Util.timestamp();
    const signature = this.getSignature(method, nonceStr, timestamp, url, body);
    const authorization = `${WX_AUTHORIZATION_TYPE} mchid="${this.options.mchId}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="${sn}",signature="${signature}"`;
    this.logger.log('authorization:', authorization);
    return authorization;
  }
  
  private async postRequest(url: string, body?: string | Record<string, any>): Promise<any> {
    const authorization = this.getAuthorization('POST', url, body);
    try {
      const response = await this.httpPost(url, body, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': '127.0.0.1',
        Authorization: authorization,
      });
      this.logger.log('微信支付POST请求结果：', response);
      return response;
    } catch (error: any) {
      // const {statusCode} = error;
      const json = await error.json?.();
      this.logger.error('微信支付POST请求失败：', json);
      throw error;
    }
  }

  // AEAD_AES_256_GCM for node
  private aeadAes256GcmEncrypt(associatedData: string, nonce: string, plaintext: string, key: string) {
    const encrypted = Buffer.from(plaintext, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAuthTag(encrypted.subarray(-16));
    decipher.setAAD(Buffer.from(associatedData));
    const output = Buffer.concat([
      decipher.update(encrypted.subarray(0, -16)),
      decipher.final(),
    ]);
    return output.toString();
  }

  public getSerialNumber() {
    if (this.options.serialNo) {
      return this.options.serialNo;
    }
    let publicKey = this.options.publicKey;
    if (!publicKey) {
      if (!this.options.publicKeyPath) {
        this.logger.error('微信支付证书序列号未配置, 请检查配置项publicKey或publicKeyPath');
        throw new Error('wechat pay publicKey missed');
      }
      publicKey = this.readFile(this.options.publicKeyPath);
    }
    if (typeof publicKey === 'string') {
      publicKey = Buffer.from(publicKey);
    }
    const pem = new crypto.X509Certificate(publicKey);
    this.options.serialNo = pem.serialNumber;
    return pem.serialNumber;
  }
  
  public async prepay(params: IRequestWechatPrepayParams) {
    const {channel, ...rest} = params;
    const res = await this.postRequest('/v3/pay/transactions/jsapi', {
      appid: this.options.appId,
      mchid: this.options.mchId,
      ...rest,
    });
    const { prepay_id } = res;
    const data = {
      appId: this.options.appId,
      timeStamp: Util.timestamp() + '',
      nonceStr: Util.randomString(16),
      package: `prepay_id=${prepay_id}`,
      signType: 'RSA',
      paySign: '',
    }
    const strForSign = [data.appId, data.timeStamp, data.nonceStr, data.package, ''].join('\n');
    data.paySign = this.sha256WithRSA(strForSign);
    return data;
  }
  public decryptCallback(body: any) {
    if (!this.options.apiKeyV3) {
      this.logger.error('微信支付v3 apiKey未配置, 请检查配置项apiKeyV3');
      throw new Error('wechat pay apiKeyV3 missed');
    }
    try {
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
    } catch (error) {
      this.logger.error('微信支付回调解析失败，json不合法');
      throw error;
    }
    const { resource } = body;
    const {ciphertext,nonce,associated_data } = resource;
    const res = this.aeadAes256GcmEncrypt(associated_data, nonce, ciphertext, this.options.apiKeyV3);
    try {
      return JSON.parse(res);
    } catch (error) {
      throw error;
    }
  }
}