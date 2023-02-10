import _ from 'lodash';
import { appConfig } from '../configs';
import { INDICATOR_TYPES } from '../constants/indicator-constant';
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
      const formattedIndicators = [];
      const indicators = await this._indicatorUtil.getAllIndicatorsByType(
        INDICATOR_TYPES
      );
      const indicatorDataObjects =
        await this._analyticsUtil.getAnalyticalDataFromServer(
          _.flattenDeep(_.map(indicators, (indicator) => indicator.id))
        );
      for (const indicator of indicators) {
        if (indicatorDataObjects[indicator.id]) {
          formattedIndicators.push({
            ...indicator,
            name : `${indicator.name}`.trim(),
            value: indicatorDataObjects[indicator.id]
          });
        }
      }
      console.log(JSON.stringify(formattedIndicators));
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'startProcess'
      );
    }
  }
}
