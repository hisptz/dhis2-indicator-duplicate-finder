// id,name,indicatorType[id,name],numerator,denominator,indicatorGroups[name,id]
export interface IndicatorModel {
  id: string;
  name: string;
  indicatorType: {
    id: string;
    name: string;
  };
  numerator: string;
  denominator: string;
  indicatorGroups: Array<{
    id: string;
    name: string;
  }>;
}
