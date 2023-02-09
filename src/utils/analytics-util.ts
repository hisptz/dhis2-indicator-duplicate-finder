import { AppUtil } from '.';

export class AnalyticsUtil {
  private _headers: {
    Authorization: string;
    'Content-Type': string;
  };

  private _baseUrl: string;
  constructor(username: string, password: string, baseUrl: string) {
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
    this._baseUrl = baseUrl;
  }
}
