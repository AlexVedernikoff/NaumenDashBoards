import { string, object } from 'yup';
import {CHART_VARIANTS} from 'utils/chart/constants';

const Shema = {};

Shema[CHART_VARIANTS.BAR] = object({
  name: string().required(),
  source: object().required(),
  xAxis: object().required(),
  yAxis: object().required()
});

Shema[CHART_VARIANTS.BAR_STACKED] = object({
  name: string().required(),
  source: object().required(),
  xAxis: object().required(),
  yAxis: object().required(),
});

Shema[CHART_VARIANTS.COLUMN] = object({
  name: string().required(),
  source: object().required(),
  xAxis: object().required(),
  yAxis: object().required(),
});

Shema[CHART_VARIANTS.COLUMN_STACKED] = object({
  name: string().required(),
  source: object().required(),
  xAxis: object().required(),
  yAxis: object().required(),
});

Shema[CHART_VARIANTS.COMBO] = object({
  name: string().required(),
  source: object().required(),
  xAxis: object().required(),
  yAxis: object().required(),
});

Shema[CHART_VARIANTS.DONUT] = object({
  name: string().required(),
  source: object().required(),
  xAxis: object().required(),
  yAxis: object().required(),
});

Shema[CHART_VARIANTS.LINE] = object({
  name: string().required(),
  source: object().required(),
  xAxis: object().required(),
  yAxis: object().required(),
});

Shema[CHART_VARIANTS.PIE] = object({
  name: string().required(),
  source: object().required(),
  xAxis: object().required(),
  yAxis: object().required(),
});

export default Shema;