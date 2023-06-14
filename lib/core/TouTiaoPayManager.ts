import { IOptionsTouTiao } from "../../types";
import { Logger } from "../logger";
import { PayManager } from "./PayManager";

// 微信支付v3
export class TouTiaoPayManager extends PayManager {
  private logger: Logger;
  private options: IOptionsTouTiao;
  constructor(options: IOptionsTouTiao, logger: Logger) {
    super();
    this.logger = logger;
    this.options = options;
  }
  async prepay() {
    return {
      order_id: '',
    }
  }
  decryptCallback() {
    
  }
}