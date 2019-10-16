import { object, string } from 'yup';
import {CHART_VARIANTS} from 'utils/chart/constants';

const insertAgregate = 'Укажите агрегацию';
const insertAttrX = 'Укажите атрибут для оси X';
const insertAttrY = 'Укажите атрибут для оси Y';
const insertBreakdown = 'Укажите разбивку';
const insertIndicator = 'Укажите показатель';
const insertName = 'Укажите название';
const insertSource = 'Укажите источник данных';
const requireParam = 'Обязательный параметр';
const Shema = {};

Shema[CHART_VARIANTS.BAR] = object({
  name: string().required(insertName),
  source: object().required(insertSource),
  xAxis: object().required(insertAttrX),
  yAxis: object().required(insertAttrY)
});

Shema[CHART_VARIANTS.BAR_STACKED] = object({
  name: string().required(insertName),
  source: object().required(insertSource),
  xAxis: object().required(insertAttrX),
  yAxis: object().required(insertAttrY)
});

Shema[CHART_VARIANTS.COLUMN] = object({
  name: string().required(insertName),
  source: object().required(insertSource),
  xAxis: object().required(insertAttrX),
  yAxis: object().required(insertAttrY)
});

Shema[CHART_VARIANTS.COLUMN_STACKED] = object({
  name: string().required(insertName),
  source: object().required(insertSource),
  xAxis: object().required(insertAttrX),
  yAxis: object().required(insertAttrY)
});

Shema[CHART_VARIANTS.COMBO] = object({
  name: string().required(insertName),
  source: object().required(insertSource),
  xAxis: object().required(insertAttrX),
  yAxis: object().required(insertAttrY)
});

Shema[CHART_VARIANTS.DONUT] = object({
  aggregation: object().required(insertAgregate),
  breakdown: object().required(insertBreakdown),
  indicator: object().required(insertIndicator),
  name: string().required(insertName),
  source: object().required(insertSource)
});

Shema[CHART_VARIANTS.LINE] = object({
  name: string().required(insertName),
  source: object().required(insertSource),
  xAxis: object().required(insertAttrX),
  yAxis: object().required(insertAttrY)
});

Shema[CHART_VARIANTS.PIE] = object({
  aggregation: object().required(insertAgregate),
  breakdown: object().required(insertBreakdown),
  indicator: object().required(insertIndicator),
  name: string().required(insertName),
  source: object().required(insertSource)
});

Shema[CHART_VARIANTS.SUMMARY] = object({
  indicator: object().required(insertIndicator),
  name: string().required(insertName),
  source: object().required(insertSource)
});

Shema[CHART_VARIANTS.TABLE] = object({
  column: object().required(requireParam),
  name: string().required(insertName),
  row: object().required(requireParam),
  source: object().required(insertSource)
});

export default Shema;
