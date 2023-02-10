import { chunk, filter, findIndex, map, sum } from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import {
  DEFAULT_DX_COUNT,
  DEFAULT_OUS,
  DEFAULT_PERIODS
} from '../constants/analytics-constant';

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

  async getAnalyticalDataFromServer(indicatorIds: string[]) {
    let dataObjects: any = {};
    try {
      const pe = DEFAULT_PERIODS.join(';');
      const ou = DEFAULT_OUS.join(';');
      const total = chunk(indicatorIds, DEFAULT_DX_COUNT).length;
      let count = 1;
      for (const dxArray of chunk(indicatorIds, DEFAULT_DX_COUNT)) {
        await new LogsUtil().addLogs(
          'info',
          `Discovering analytical data from server :: ${count}/${total}`,
          'getAnalyticalDataFromServer'
        );
        const dx = dxArray.join(';');
        const url = `${this._baseUrl}/api/29/analytics?dimension=pe:${pe}&filter=ou:${ou}&dimension=dx:${dx}`;
        const response: any = await HttpUtil.getHttp(this._headers, url);
        const formattedDataObject = await this.getformattedDataObjects(
          response,
          dxArray
        );
        dataObjects = { ...dataObjects, ...formattedDataObject };
        count ++;
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'getAnalyticalDataFromServer'
      );
    }
    return dataObjects;
  }

  async getformattedDataObjects(
    response: any,
    dxArray: string[]
  ): Promise<any> {
    const dataObjects: any = {};
    try {
      const dxIndex = findIndex(
        response.headers || [],
        (header: any) => header && header.name && header.name === 'dx'
      );
      const valueIndex = findIndex(
        response.headers || [],
        (header: any) => header && header.name && header.name === 'value'
      );
      for (const dxId of dxArray) {
        const values = map(
          filter(response.rows || [], (row) => {
            return row[dxIndex] === dxId;
          }),
          (row) => parseFloat(row[valueIndex])
        );
        if (values.length > 0) {
          dataObjects[dxId] = sum(values);
        }
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'getformattedDataObjects'
      );
    }
    return dataObjects;
  }
}
