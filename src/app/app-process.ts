import _, { flattenDeep, groupBy, keys, sortBy } from 'lodash';
import { appConfig } from '../configs';
import { INDICATOR_TYPES } from '../constants/indicator-constant';
import { IndicatorModel } from '../models/indicator-model';
import { AnalyticsUtil, AppUtil, IndicatorUtil, LogsUtil } from '../utils';

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
      const formattedIndicators = await this._getIndicatorWithValues();
      const possibleDuplicateIndicators =
        this._getPossibleDuplicateIndicators(formattedIndicators);
      console.log(possibleDuplicateIndicators);
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'startProcess'
      );
    }
  }

  private _getPossibleDuplicateIndicators(
    formattedIndicators: IndicatorModel[]
  ): IndicatorModel[] {
    const possibleDuplicateIndicators: IndicatorModel[] = [];
    const groupedIndicators = groupBy(
      formattedIndicators,
      (indicator) => indicator.value
    );
    for (const indicatorValue of keys(groupedIndicators)) {
      const indicators = groupedIndicators[indicatorValue] ?? [];
      if (indicators.length > 1) {
        const overallNumeratorExpression =
          AppUtil.getDataElementsFromExpression(indicators[0].numerator).join(
            '_'
          );
        const overallDenominatorExpression =
          AppUtil.getDataElementsFromExpression(indicators[0].denominator).join(
            '_'
          );
        for (const indicator of indicators) {
          const numeratorExpression = AppUtil.getDataElementsFromExpression(
            indicator.numerator
          ).join('_');
          const denominatorExpression = AppUtil.getDataElementsFromExpression(
            indicator.denominator
          ).join('_');
          if (
            overallNumeratorExpression === numeratorExpression &&
            overallDenominatorExpression === denominatorExpression
          ) {
            possibleDuplicateIndicators.push(indicator);
          }
        }
      }
    }
    return sortBy(flattenDeep(possibleDuplicateIndicators), ['name']);
  }

  private async _getIndicatorWithValues() {
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
          name: `${indicator.name}`.trim(),
          value: indicatorDataObjects[indicator.id]
        });
      }
    }
    return formattedIndicators;
  }
}
