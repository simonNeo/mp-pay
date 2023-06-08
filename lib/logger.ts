import { TLogLevel } from "../types";
import { moduleName } from "./constants";

export class Logger {
  private logLevel: TLogLevel[];
  constructor (logLevel: TLogLevel | TLogLevel[]) {
    this.logLevel = Array.isArray(logLevel) ? logLevel : [logLevel];
  }
  logPrefix () {
    return `[${moduleName}]: `;
  }
  warn (...params: any[]) {
    if (this.logLevel.includes('warn')) {
      console.warn(this.logPrefix(), ...params);
    }
  }
  error (...params: any[]) {
    if (this.logLevel.includes('error')) {
      console.error(this.logPrefix(), ...params);
    }
  }
  log (...params: any[]) {
    if (this.logLevel.includes('log')) {
      console.log(this.logPrefix(), ...params);
    }
  }
  
}