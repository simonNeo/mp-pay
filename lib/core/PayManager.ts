import { TPrepayParams, TPrepayResult } from "../../types";

export abstract class PayManager {
  protected readFile(path: string): Buffer {
    const fs = require('fs') as typeof import('fs');
    return fs.readFileSync(path);
  }
  public abstract prepay(payOption: TPrepayParams): Promise<TPrepayResult>;
  public abstract decryptCallback(body: any): any;
}