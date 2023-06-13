import { ITouTiaoPrepayP } from "./toutiao";
import { IWechatPrepayP } from "./wechat";

export type TSupportedChannel = 'wx' | 'tt';
export type TLogLevel = 'log' | 'warn' | 'error';

export interface IOptionsTouTiao {
  appId: string;
}
export interface IOptionsWechat {
  appId: string;
}

export interface IOptions {
  logLevel?: TLogLevel | TLogLevel[];
  tt?: IOptionsTouTiao;
  wx?: IOptionsWechat;
}

type InferOption<T> = T extends 'wx' ? IWechatPrepayP : unknown;

export interface IWechatPrepayParams extends IWechatPrepayP {
  channel: 'wx';
}

export interface ITouTiaoPrepayParams extends ITouTiaoPrepayP {
  channel: 'tt';
}

export type TPrePayParams = IWechatPrepayParams | ITouTiaoPrepayParams;