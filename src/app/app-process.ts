import _ from 'lodash';
import { appConfig } from '../configs';
import { AnalyticsUtil, IndicatorUtil, LogsUtil } from '../utils';

export class AppProcess {
  private _analyticsUtil: AnalyticsUtil;
  private _indicatorUtil: IndicatorUtil;

  constructor() {
    this._analyticsUtil = new AnalyticsUtil(
      appConfig.username,
      appConfig.password,
      appConfig.baseUrl
    );
    this._indicatorUtil = new IndicatorUtil(
      appConfig.username,
      appConfig.password,
      appConfig.baseUrl
    );
  }

  async startProcess() {
    try {
      // TODO logics for data
      console.log('Todo handle logics for the script');
      // get indicator details by indicator types -> number
      // get indicator with similar data elements as numberator and denominator
      // get indicator analyics values
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'startProcess'
      );
    }
  }
}
