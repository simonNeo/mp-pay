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