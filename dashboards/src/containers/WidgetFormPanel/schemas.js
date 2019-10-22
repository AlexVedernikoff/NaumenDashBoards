// @flow
import {CHART_VARIANTS} from 'utils/chart/constants';
import {object, string} from 'yup';

const insertAggregation = 'Укажите агрегацию';
const insertXAxis = 'Укажите атрибут для оси X';
const insertYAxis = 'Укажите атрибут для оси Y';
const insertBreakdown = 'Укажите разбивку';
const insertIndicator = 'Укажите показатель';
const insertName = 'Укажите название виджета';
const insertDiagramName = 'Укажите название виджета';
const insertSource = 'Укажите источник данных';
const requireParam = 'Обязательный параметр';
const Schema = {};

Schema[CHART_VARIANTS.BAR] = object({
	diagramName: string().required(insertDiagramName),
	name: string().required(insertName),
	source: object().nullable().required(insertSource),
	xAxis: object().nullable().required(insertXAxis),
	yAxis: object().nullable().required(insertYAxis)
});

Schema[CHART_VARIANTS.BAR_STACKED] = object({
	diagramName: string().required(insertDiagramName),
	name: string().required(insertName),
	source: object().nullable().required(insertSource),
	xAxis: object().nullable().required(insertXAxis),
	yAxis: object().nullable().required(insertYAxis)
});

Schema[CHART_VARIANTS.COLUMN] = object({
	diagramName: string().required(insertDiagramName),
	name: string().required(insertName),
	source: object().nullable().required(insertSource),
	xAxis: object().nullable().required(insertXAxis),
	yAxis: object().nullable().required(insertYAxis)
});

Schema[CHART_VARIANTS.COLUMN_STACKED] = object({
	diagramName: string().required(insertDiagramName),
	name: string().required(insertName),
	source: object().nullable().required(insertSource),
	xAxis: object().nullable().required(insertXAxis),
	yAxis: object().nullable().required(insertYAxis)
});

Schema[CHART_VARIANTS.COMBO] = object({
	diagramName: string().required(insertDiagramName),
	name: string().required(insertName)
});

Schema[CHART_VARIANTS.DONUT] = object({
	aggregation: object().nullable().required(insertAggregation),
	breakdown: object().nullable().required(insertBreakdown),
	diagramName: string().required(insertDiagramName),
	indicator: object().nullable().required(insertIndicator),
	name: string().required(insertName),
	source: object().nullable().required(insertSource)
});

Schema[CHART_VARIANTS.LINE] = object({
	diagramName: string().required(insertDiagramName),
	name: string().required(insertName),
	source: object().nullable().required(insertSource),
	xAxis: object().nullable().required(insertXAxis),
	yAxis: object().nullable().required(insertYAxis)
});

Schema[CHART_VARIANTS.PIE] = object({
	aggregation: object().nullable().required(insertAggregation),
	breakdown: object().nullable().required(insertBreakdown),
	diagramName: string().required(insertDiagramName),
	indicator: object().nullable().required(insertIndicator),
	name: string().required(insertName),
	source: object().nullable().required(insertSource)
});

Schema[CHART_VARIANTS.SUMMARY] = object({
	diagramName: string().required(insertDiagramName),
	indicator: object().nullable().required(insertIndicator),
	name: string().required(insertName),
	source: object().nullable().required(insertSource)
});

Schema[CHART_VARIANTS.TABLE] = object({
	column: object().nullable().required(requireParam),
	diagramName: string().required(insertDiagramName),
	name: string().required(insertName),
	row: object().nullable().required(requireParam),
	source: object().nullable().required(insertSource)
});

export default Schema;
