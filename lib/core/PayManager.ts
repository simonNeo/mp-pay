import { TPrePayParams, TSupportedChannel } from "../../types";

export abstract class PayManager {
  abstract pay(payOption: TPrePayParams): any;
}