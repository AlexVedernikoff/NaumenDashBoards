// @flow
import type {ApexOptions} from 'apexcharts';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {axisLabelFormatter, getXAxisOptions, getYAxisOptions, valueFormatter} from './helpers';
import type {AxisWidget, BuildAxisData} from 'store/widgets/data/types';
import {DATETIME_FORMATS} from 'components/molecules/GroupCreatingModal/components/DateSystemGroup/constants';
import {DEFAULT_AGGREGATION, GROUP_WAYS} from 'store/widgets/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval} from 'store/widgets/helpers';
import moment from 'moment';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Проверяет должны ли использоваться для построения данные в формате даты
 * @param {BuildAxisData} set - данные для построения осевого графика
 * @returns {boolean}
 */
const hasDatetime = (set: BuildAxisData) => {
	const {group, xAxis} = set;
	const {format, way} = group;

	return xAxis.type in ATTRIBUTE_SETS.DATE && way === GROUP_WAYS.SYSTEM && DATETIME_FORMATS.includes(format);
};

/**
 * Преобразует значение по оси X из строки в дату
 * @param {string} format - формат группировки
 * @returns {Function}
 */
const parseToDatetime = (format?: string) => (value: string) => {
	switch (format) {
		case 'dd.mm.YY hh:ii':
			return moment(value, 'DD.MM.YYYY h:mm').format();
		case 'dd.mm.YY hh':
			return moment(value, 'DD.MM.YYYY hh').format();
		case 'MM YY':
			return moment(value, 'MMMM YYYY').format();
		case 'yyyy':
			return moment(value, 'YYYY').format();
		default:
			return moment(value, 'DD.MM.YYYY').format();
	}
};

/**
 * Возвращает представления значений дат оси X
 * @param {string} format - формат группировки
 * @returns {object}
 */
const getDatetimeFormatter = (format?: string) => {
	switch (format) {
		case 'dd.mm.YY hh:ii':
			return {
				day: 'dd.MM.yyyy',
				hour: 'dd.MM.yyyy hч',
				minute: 'dd.MM.yyyy hh:mm',
				month: 'MM.yyyy',
				year: 'yyyy'
			};
		case 'dd.mm.YY hh':
			return {
				day: 'dd.MM.yyyy',
				hour: 'dd.MM.yyyy hч',
				minute: '',
				month: 'MM.yyyy',
				year: 'yyyy'
			};
		case 'dd.mm.YY':
			return {
				day: 'dd.MM.yyyy',
				hour: '',
				minute: '',
				month: 'MM.yyyy',
				year: 'yyyy'
			};
		case 'MM YY':
			return {
				day: '',
				hour: '',
				minute: '',
				month: 'MMMM yyyy',
				year: 'yyyy'
			};
		case 'yyyy': {
			return {
				day: '',
				hour: '',
				minute: '',
				month: '',
				year: 'yyyy'
			};
		}
	}
};

/**
 * Примесь графиков по умолчанию (bar, column, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {ApexOptions}
 */
const axisMixin = (horizontal: boolean, stacked: boolean = false) => (widget: AxisWidget, chart: DiagramBuildData): ApexOptions => {
	const {indicator, parameter, type} = widget;
	const {categories} = chart;
	const set = getBuildSet(widget);

	if (set && !set.sourceForCompute) {
		const {aggregation, group} = set;
		const usesDatetime = hasDatetime(set);
		const usesMSInterval = hasMSInterval(set, FIELDS.yAxis);
		const usesPercent = aggregation === DEFAULT_AGGREGATION.PERCENT;
		const stackType = usesPercent && stacked ? '100%' : 'normal';
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;
		let xaxis;

		if (usesDatetime) {
			const {format} = group;

			xaxis = {
				categories: categories.map(parseToDatetime(format)),
				labels: {
					datetimeFormatter: getDatetimeFormatter(format)
				},
				type: 'datetime'
			};
		} else {
			xaxis = {
				categories,
				labels: {
					formatter: horizontal ? valueFormatter(usesMSInterval, usesPercent) : axisLabelFormatter
				},
				tickPlacement: 'on'
			};
		}

		const yaxis = {
			forceNiceScale: !stacked && !usesPercent,
			labels: {
				formatter: horizontal ? axisLabelFormatter : valueFormatter(usesMSInterval, usesPercent)
			}
		};

		return {
			chart: {
				stackType,
				stacked
			},
			dataLabels: {
				formatter: valueFormatter(usesMSInterval, usesPercent, false)
			},
			markers: {
				hover: {
					size: 8
				},
				size: 5
			},
			plotOptions: {
				bar: {
					horizontal
				}
			},
			stroke: {
				width: strokeWidth
			},
			tooltip: {
				intersect: true,
				shared: false,
				y: {
					formatter: valueFormatter(usesMSInterval, usesPercent && !stacked)
				}
			},
			xaxis: extend(xaxis, getXAxisOptions(parameter)),
			yaxis: extend(yaxis, getYAxisOptions(indicator))
		};
	}
};

export default axisMixin;
