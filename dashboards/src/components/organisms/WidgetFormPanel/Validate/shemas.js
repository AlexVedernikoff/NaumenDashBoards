import { string, object } from 'yup';
import {CHART_VARIANTS} from 'utils/chart/constants';

const Shema = {};
const text0 = 'Обязательный параметр';
const text1 = 'Укажите название';
const text2 = 'Укажите источник данных';
const text3 = 'Укажите атрибут для оси X';
const text4 = 'Укажите атрибут для оси Y';
const text5 = 'Укажите разбивку';
const text6 = 'Укажите агрегацию';
const text7 = 'Укажите показатель';

Shema[CHART_VARIANTS.BAR] = object({
  name: string().required(text1),
  source: object().required(text2),
  xAxis: object().required(text3),
  yAxis: object().required(text4)
});

Shema[CHART_VARIANTS.BAR_STACKED] = object({
  name: string().required(text1),
  source: object().required(text2),
  xAxis: object().required(text3),
  yAxis: object().required(text4)
});

Shema[CHART_VARIANTS.COLUMN] = object({
  name: string().required(text1),
  source: object().required(text2),
  xAxis: object().required(text3),
  yAxis: object().required(text4)
});

Shema[CHART_VARIANTS.COLUMN_STACKED] = object({
  name: string().required(text1),
  source: object().required(text2),
  xAxis: object().required(text3),
  yAxis: object().required(text4)
});

Shema[CHART_VARIANTS.COMBO] = object({
  name: string().required(text1),
  source: object().required(text2),
  xAxis: object().required(text3),
  yAxis: object().required(text4)
});

Shema[CHART_VARIANTS.DONUT] = object({
  name: string().required(text1),
  source: object().required(text2),
  breakdown: object().required(text5),
  aggregation: object().required(text6),
  indicator: object().required(text7)
});

Shema[CHART_VARIANTS.LINE] = object({
  name: string().required(text1),
  source: object().required(text2),
  xAxis: object().required(text3),
  yAxis: object().required(text4)
});

Shema[CHART_VARIANTS.PIE] = object({
  name: string().required(text1),
  source: object().required(text2),
  breakdown: object().required(text5),
  aggregation: object().required(text6),
  indicator: object().required(text7)
});

Shema[CHART_VARIANTS.TABLE] = object({
  name: string().required(text1),
  source: object().required(text2),
  column: object().required(text0),
  row: object().required(text0)
});

Shema[CHART_VARIANTS.SUMMARY] = object({
  name: string().required(text1),
  source: object().required(text2),
  indicator: object().required(text7)
});

export default Shema;
