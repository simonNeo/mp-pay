import { moduleName } from "./lib/constants";
import { Logger } from "./lib/logger";
import { IOptions, TSupportedChannel } from "./types";

export class CommonPay {
  private options: IOptions;
  private logger: Logger;
  constructor(options: IOptions) {
    this.logger = new Logger(options.logLevel || ['error', 'log', 'warn']);
    this.options = options;
  }
  private getOption(chanel: TSupportedChannel) {
    return this.options[chanel];
  }
}