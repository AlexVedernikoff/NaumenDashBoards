// @flow
import type {ApexOptions} from 'apexcharts';
import type {ApexYAxisOptions} from 'utils/chart/types';
import {
	axisLabelFormatter,
	checkLabelsForOverlap,
	getLegendOptions,
	getMaxValue,
	getNiceScale,
	getXAxisLabels,
	getXAxisOptions,
	valueFormatter
} from './helpers';
import type {ComboWidget} from 'store/widgets/data/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_Y_AXIS_MIN} from 'utils/chart/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'src/helpers';
import {FIELDS} from 'DiagramWidgetEditForm';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent, hasUUIDsInLabels} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const dataLabelsFormatter = (widget: ComboWidget, showZero: boolean) => (value: number, ctx: Object) => {
	const {seriesIndex, w} = ctx;
	const {series} = w.config;

	const buildDataSet = widget.data.find(dataSet => dataSet.dataKey === series[seriesIndex].dataKey);
	let formattedValue = value;

	if (buildDataSet && !buildDataSet.sourceForCompute) {
		const {aggregation} = buildDataSet;
		const usesMSInterval = hasMSInterval(buildDataSet, FIELDS.yAxis);
		const usesPercent = aggregation === DEFAULT_AGGREGATION.PERCENT;
		formattedValue = valueFormatter(usesMSInterval, usesPercent, showZero)(value);
	}

	return formattedValue;
};

/**
 * Возвращает настройки оси Y
 * @param {DataSet} dataSet - набор данных виджета, относительно которого настраивается ось
 * @param {number} index - индекс набора данных виджета
 * @param {ComboWidget} widget - виджет
 * @param {boolean} forceHide - указывает на необходимость скрывать ось.
 * @param {?number} maxValue - максимальное значение
 * @returns {ApexYAxisOptions}
 */
const getYAxis = (dataSet: DataSet, index: number, widget: ComboWidget, forceHide: boolean, maxValue?: number) => {
	const {colors, indicator} = widget;
	const {dataKey, showEmptyData, yAxisName: name} = dataSet;
	const usesMSInterval = hasMSInterval(dataSet, FIELDS.yAxis);
	const usesPercent = hasPercent(dataSet, FIELDS.yAxis);
	const color = colors[index];
	let {max, min = DEFAULT_Y_AXIS_MIN, show, showName} = indicator;

	if (min) {
		min = Number(min);
	}

	if (max) {
		max = Number(max);
	} else if (maxValue) {
		max = getNiceScale(maxValue);
	}

	return {
		axisBorder: {
			color,
			show: true
		},
		axisTicks: {
			show: true
		},
		forceNiceScale: true,
		labels: {
			formatter: valueFormatter(usesMSInterval, usesPercent, showEmptyData),
			maxWidth: 140,
			style: {
				colors: color
			}
		},
		max,
		min,
		opposite: index > 0,
		seriesName: dataKey,
		show: !forceHide && show,
		title: {
			style: {
				color
			},
			text: showName ? name : undefined
		}
	};
};

/**
 * Возвращает настройки осей Y относительно каждого объекта данных series
 * @param {ComboWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @param {?number} maxValue - максимальное значение по оси
 * @returns {Array<ApexYAxisOptions>}
 */
const getYAxises = (widget: ComboWidget, chart: DiagramBuildData, maxValue?: number): Array<ApexYAxisOptions> => {
	const usedDataKeys = [];

	return chart.series.map((s, i) => {
		const {dataKey} = s;
		const dataSet = widget.data.find(dataSet => dataSet.dataKey === dataKey);

		if (dataSet) {
			/**
			 * Настройка осей идет относительно объектов series, но на графике должно отображаться количество осей относительно
			 * количества источников (в случае разбивки на 1 источник приходит n-е количество данных series). По этому ось
			 * отрисовывается только относительно первого набора значений разбивки. Остальные оси разбивки по источнику скрываются.
			 * @type {boolean}
			 */
			let forceHide = false;

			if (usedDataKeys.includes(dataKey)) {
				forceHide = true;
			} else {
				usedDataKeys.push(dataKey);
			}

			return getYAxis(dataSet, i, widget, forceHide, maxValue);
		}
	}).filter(yaxis => yaxis);
};

/**
 * Примесь combo-графиков
 * @param {ComboWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @returns {ApexOptions}
 */
const comboMixin = (widget: ComboWidget, chart: DiagramBuildData, container: HTMLDivElement): ApexOptions => {
	const {legend, parameter} = widget;
	const {labels, series} = chart;
	const strokeWidth = series.find(dataSet => dataSet.type.toUpperCase() === WIDGET_TYPES.LINE) ? 4 : 0;
	const stacked = widget.data.findIndex(dataSet => dataSet.type && dataSet.type === WIDGET_TYPES.COLUMN_STACKED) !== -1;
	const buildDataSet = getBuildSet(widget);
	const {showEmptyData} = buildDataSet;
	let parameterUsesUUIDs = false;
	let breakdownUsesUUIDs = false;
	let maxValue;

	widget.data.forEach(dataSet => {
		if (!dataSet.sourceForCompute) {
			parameterUsesUUIDs = !parameterUsesUUIDs || hasUUIDsInLabels(dataSet, FIELDS.xAxis);
			breakdownUsesUUIDs = !breakdownUsesUUIDs || hasUUIDsInLabels(dataSet, FIELDS.breakdown);
		}
	});

	if (widget.indicator.showDependent || stacked) {
		maxValue = getMaxValue(series, stacked);
	}

	const hasOverlappedLabel = checkLabelsForOverlap(labels, container, legend);
	const xaxis = {
		labels: {
			formatter: axisLabelFormatter(parameterUsesUUIDs)
		},
		tickPlacement: 'between'
	};

	return {
		chart: {
			stacked
		},
		dataLabels: {
			formatter: dataLabelsFormatter(widget, showEmptyData)
		},
		grid: {
			padding: {
				bottom: 20
			}
		},
		labels: getXAxisLabels(widget, labels, !hasOverlappedLabel),
		legend: getLegendOptions(legend, container, breakdownUsesUUIDs),
		markers: {
			hover: {
				size: 8
			},
			size: 5
		},
		stroke: {
			width: strokeWidth
		},
		tooltip: {
			intersect: true,
			shared: false
		},
		xaxis: extend(xaxis, getXAxisOptions(parameter, hasOverlappedLabel)),
		yaxis: getYAxises(widget, chart, maxValue)
	};
};

export default comboMixin;
