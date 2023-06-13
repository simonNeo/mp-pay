import { TPrePayParams } from "../../types";

export abstract class PayManager {
  abstract pay(payOption: TPrePayParams): any;
}