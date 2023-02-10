import { flattenDeep } from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import { IndicatorModel, IndicatorTypeModel } from '../models';

export class IndicatorUtil {
  private _headers: {
    Authorization: string;
    'Content-Type': string;
  };
  private _baseUrl: string;
  private _pageSize = 500;

  constructor(username: string, password: string, baseUrl: string) {
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
    this._baseUrl = baseUrl;
  }

  async getIndicatorTypesFromSystem(): Promise<IndicatorTypeModel[]> {
    const indicatorTypes: any = [];
    try {
      const url = `${this._baseUrl}/api/indicatorTypes.json?fields=id,name&paging=false`;
      const response: any = await HttpUtil.getHttp(this._headers, url);
      indicatorTypes.push(response.indicatorTypes || []);
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'getAllIndicatorsByType'
      );
    }
    return indicatorTypes;
  }

  async getAllIndicatorsByIndicatorType(indicatorType: string) {
    const indicators: IndicatorModel[] = [];
    try {
      const fields =
        'fields=id,name,indicatorType[id,name],numerator,denominator,indicatorGroups[name,id]';
      const filteredUrl = `${this._baseUrl}/api/indicators.json?filter=indicatorType.id:eq:${indicatorType}`;
      await new LogsUtil().addLogs(
        'info',
        `Discovering pagination for indicator list`,
        'getAllIndicatorsByType'
      );
      const responseWithPagenation: any = await HttpUtil.getHttp(
        this._headers,
        `${filteredUrl}&fields=none&pageSize=1`
      );
      const pageFilters = AppUtil.getPaginationsFilters(
        responseWithPagenation,
        this._pageSize
      );
      let indicatorPageCount = 1;
      for (const pageFilter of pageFilters) {
        await new LogsUtil().addLogs(
          'info',
          `Discovering indicators :: ${indicatorPageCount}/${pageFilters.length} ::> ${pageFilter}`,
          'getAllIndicatorsByType'
        );
        const response: any = await HttpUtil.getHttp(
          this._headers,
          `${filteredUrl}&${pageFilter}&${fields}`
        );
        indicators.push(response.indicators || []);
        indicatorPageCount++;
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'getAllIndicatorsByType'
      );
    }
    return flattenDeep(indicators);
  }
}
