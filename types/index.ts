import { ITouTiaoPrepayParams } from "./toutiao";
import { IOptionsWechat, IWechatPrepayParams, IWechatPrepayResult } from "./wechat";

export type TSupportedChannel = 'wx' | 'tt';
export type TLogLevel = 'log' | 'warn' | 'error';
export type TSupportedMethods = 'POST' | 'GET' | 'PUT';

export interface IOptionsTouTiao {
  appId: string;
}

export interface IOptions {
  logLevel?: TLogLevel | TLogLevel[];
  tt?: IOptionsTouTiao;
  wx?: IOptionsWechat;
}

export interface IRequestWechatPrepayParams extends IWechatPrepayParams {
  channel: 'wx';
}

export interface IRequestTouTiaoPrepayParams extends ITouTiaoPrepayParams {
  channel: 'tt';
}

export type TPrepayParams = IRequestWechatPrepayParams | IRequestTouTiaoPrepayParams;
export type TPrepayResult = IWechatPrepayResult;