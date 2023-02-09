import { chunk, flattenDeep } from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import { IndicatorModel } from '../models/indicator-model';

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

  async getAllIndicatorsByType(indicatorTypes: string[]) {
    const indicators: IndicatorModel[] = [];
    try {
      const indicatorTypesFilters = indicatorTypes.join(',');
      const fields =
        'fields=id,name,indicatorType[id,name],numerator,denominator,indicatorGroups[name,id]';
      const filteredUrl = `${this._baseUrl}/api/indicators.json?filter=indicatorType.id:in:[${indicatorTypesFilters}]`;
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
