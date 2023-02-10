import { appConfig } from '../configs';
import { IndicatorUtil, LogsUtil } from '../utils';
import { IndicatorDuplicator } from '.';

export class AppProcess {
  private _indicatorUtil: IndicatorUtil;
  private _indicatorDuplicator: IndicatorDuplicator;

  constructor() {
    this._indicatorUtil = new IndicatorUtil(
      appConfig.username,
      appConfig.password,
      appConfig.baseUrl
    );
    this._indicatorDuplicator = new IndicatorDuplicator();
  }

  async startProcess() {
    try {
      const indicatorTypes =
        await this._indicatorUtil.getIndicatorTypesFromSystem();
      for (const indicatorType of indicatorTypes) {
        await new LogsUtil().addLogs(
          'info',
          `Start process of determine possible indicator with '${indicatorType.name}' as indicator type`,
          'startProcess'
        );
        await this._indicatorDuplicator.startProcessByIndicatorType(
          indicatorType
        );
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'startProcess'
      );
    }
  }
}
