import _, { flattenDeep, groupBy, join, keys, map, sortBy } from 'lodash';
import { appConfig } from '../configs';
import { INDICATOR_TYPES } from '../constants/indicator-constant';
import { IndicatorModel } from '../models/indicator-model';
import {
  AnalyticsUtil,
  AppUtil,
  ExcelUtil,
  IndicatorUtil,
  LogsUtil
} from '../utils';

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
      await this._generateExcelFile(possibleDuplicateIndicators);
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'startProcess'
      );
    }
  }

  private async _generateExcelFile(
    possibleDuplicateIndicators: IndicatorModel[]
  ) {
    const jsonData = flattenDeep(
      map(possibleDuplicateIndicators, (indicator) => {
        return {
          id: indicator.id,
          name: indicator.name,
          indicatorType: indicator.indicatorType?.name,
          value: indicator.value ?? '',
          indicatorGroups: join(
            flattenDeep(
              map(
                indicator.indicatorGroups || [],
                (indicatorGroup) => indicatorGroup.name || ''
              )
            ).sort(),
            ', '
          )
        };
      })
    );
    await new ExcelUtil('possible-duplicate').writeToSingleSheetExcelFile(
      jsonData,
      false,
      'indicator-list'
    );
  }

  private _getPossibleDuplicateIndicators(
    formattedIndicators: IndicatorModel[]
  ): IndicatorModel[] {
    const possibleDuplicateIndicators: any[] = [];
    const groupedIndicators = groupBy(
      formattedIndicators,
      (indicator) => indicator.value
    );
    for (const indicatorValue of keys(groupedIndicators)) {
      const duplicateIndicators: any[] = []; 
      const indicators = groupedIndicators[indicatorValue] ?? [];
      if (indicators.length > 1) {
        const overallNumeratorExpression = join(
          AppUtil.getDataElementsFromExpression(indicators[0].numerator),
          '_'
        );
        const overallDenominatorExpression = join(
          AppUtil.getDataElementsFromExpression(indicators[0].denominator),
          '_'
        );
        for (const indicator of indicators) {
          const numeratorExpression = join(
            AppUtil.getDataElementsFromExpression(indicator.numerator),
            '_'
          );
          const denominatorExpression = join(
            AppUtil.getDataElementsFromExpression(indicator.denominator),
            '_'
          );
          if (
            overallNumeratorExpression === numeratorExpression &&
            overallDenominatorExpression === denominatorExpression
          ) {
            duplicateIndicators.push(indicator);
          }
        }
      }
      if(duplicateIndicators.length > 1){
        possibleDuplicateIndicators.push(duplicateIndicators);
      }
    }
    return flattenDeep(possibleDuplicateIndicators);
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
