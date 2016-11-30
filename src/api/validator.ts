// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiError} from './apierror';

/**
 * Utility to validate input parameters and used by Controller.
 */
export class Validator {
  errors: Array<ApiError> = [];

  /**
   * Returns true if encounter errors through routine.
   * @returns {boolean} true if encounter errors through routine.
   */
  hasErrors(): boolean {
    return (this.errors.length > 0);
  }

  /**
   * Casts any type to number and record error if result is not a number.
   * @param param Any type of input value.
   * @param reason Error reason.
   * @returns {number} Result, should be number type if success.
   */
  toNumber(param: any, reason: string = 'param invalid'): number {
    let result: any = Number(param);
    if (isNaN(result)) {
      this.errors.push(new ApiError(reason, 'Bad Request'));
    }
    return result;
  }

  /**
   * Casts any type to string.
   * @param param Any type of input value.
   * @param reason Error reason.
   * @returns {String} Result, should be string type if success.
   */
  toStr(param: any, reason: string = 'param invalid'): string {
    return String(param);
  }

  /**
   * Casts any type to date.
   * @param param Any type of input value.
   * @param reason Error reason.
   * @returns {String} Result, should be date type if success.
   */
  toDate(param: any, reason: string = 'param invalid'): Date {
    let result: any = new Date(param);
    if (!result) {
      this.errors.push(new ApiError(reason, 'Bad Request'));
    }
    return result;
  }

  /**
   * Casts any type to unix timestamp.
   * @param param Any type of input value.
   * @param reason Error reason.
   * @returns {String} Result, should be number(int) if success.
   */
  toUnixTimestamp(param: any, reason: string = 'param invalid'): number {
    let result: any = new Date(param);
    if (!result || isNaN(result)) {
      this.errors.push(new ApiError(reason, 'Bad Request'));
    }
    result = Math.floor(result.getTime() / 1000);
    return result;
  }

  /**
   * Casts any type to boolean.
   */
  toBoolean(param: any, reason: string = 'param invalid'): Boolean {
    if (param === typeof Boolean) {
      return Boolean(param);
    } else {
      this.errors.push(new ApiError(reason, 'Bad Request'));
      return param;
    }
  }

  /**
   * Asserts condition is true, otherwise it will records the error.
   * @param cond Condition.
   * @param reason Error reason.
   */
  assert(cond: boolean, reason: string): void {
    if (!cond) {
      this.errors.push(new ApiError(reason, 'Bad Request'));
    }
  }
}
