import { Logger } from "./lib/logger";
import { IOptions, IOptionsTouTiao, IOptionsWechat, TSupportedChannel } from "./types";

export class CommonPay {
  private options: IOptions;
  private logger: Logger;
  constructor(options: IOptions) {
    this.logger = new Logger(options?.logLevel || ['error', 'log', 'warn']);
    this.options = options;
  }
  private getOption(channel: TSupportedChannel): IOptionsWechat | IOptionsTouTiao {
    return this.options[channel]!;
  }
}