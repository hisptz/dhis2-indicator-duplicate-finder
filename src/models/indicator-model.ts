import { IndicatorTypeModel } from '.';

export interface IndicatorModel {
  id: string;
  name: string;
  publicAccess: string;
  indicatorType: IndicatorTypeModel;
  numerator: string;
  denominator: string;
  indicatorGroups: Array<{
    id: string;
    name: string;
  }>;
  value?: string;
}
