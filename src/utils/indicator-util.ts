import { AppUtil } from '.';

export class IndicatorUtil {
  private _headers: {
    Authorization: string;
    'Content-Type': string;
  };

  //api/indicators.json?fields=id,name,indicatorType[id,name],numerator,denominator,indicatorGroups[name,id]&filter=indicatorType.id:in:[fJAlH7FSAeG]

  private _baseUrl: string;
  constructor(username: string, password: string, baseUrl: string) {
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
    this._baseUrl = baseUrl;
  }
}
