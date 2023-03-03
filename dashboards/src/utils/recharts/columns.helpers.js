// @flow
import {AXIS_FORMAT_TYPE} from 'store/widgets/data/constants';
import type {AxisOptions, ContainerSize, ReChartLegend, RechartData, RechartDomains} from './types';
import type {AxisWidget} from 'store/widgets/data/types';
import {
	calculateStringsSize,
	calculateYAxisNumberWidth,
	getNiceScale,
	getNiceScaleDTInterval,
	getRechartAxisSetting
} from './helpers';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {LEGEND_ALIGN} from './constants';
import type {ValueFormatter} from 'utils/recharts/formater/types';

/**
 * Нормализация данных для процентных столбовых диаграмм
 * @param  {RechartData} data - обработанные данные виджета
 * @returns  {RechartData} - нормализованные данные виджета
 */
const normalizeSeries = (data: RechartData): RechartData =>
	data.map(({name, ...values}) => {
		const result = {name};
		const rowValueSum = Object.values(values).reduce((sum, value) => sum + (+value), 0);

		Object.entries(values).forEach(([key, value]) => {
			result[key] = rowValueSum === 0 ? 0 : (+value) * 100 / rowValueSum;
		});

		return result;
	});

/**
 * Формирует параметры оси Y
 * @param {AxisWidget} widget - виджет
 * @param {DiagramBuildData} data - данные виджета
 * @param {ValueFormatter} formatter - форматер для значений/индикатора
 * @param {string} axisName - название оси виджета
 * @returns {AxisOptions} - параметры оси Y
 */
const getYAxisNumber = (
	widget: AxisWidget,
	data: DiagramBuildData,
	formatter: ValueFormatter,
	axisName: string = ''
): AxisOptions => {
	const settings = getRechartAxisSetting(widget.indicator);
	const formattedSeries = data.series.flatMap(el => el.data.map(val => formatter(val)));
	const maxValueLength = Math.max(...formattedSeries.map(val => String(val).length), 0);
	const maxString = Array(maxValueLength + 1).fill('0').join('');
	const width = calculateYAxisNumberWidth(maxString, settings, axisName);
	const domain = [0, value => value];

	return {...settings, axisName, domain, width};
};

/**
 * Вычисляет домен для оси Y с учетом размеров виджета и "красоты' чисел, чтобы границы на оси
 * выглядели более эстетично и были легко воспринимаемыми для пользователей
 * @param {AxisWidget} widget - виджет
 * @param {ContainerSize} container - размеры контейнера
 * @param {AxisOptions} xAxis - частичные параметры оси X
 * @param {AxisOptions} yAxis - частичные параметры оси Y
 * @param {ReChartLegend} legend - частичные параметры легенды
 * @param {boolean} isNormalized - индикатор нормализации виджета
 * @returns {RechartDomains} - домен для оси Y
 */
const getYAxisDomainNiceScale = (
	widget: AxisWidget,
	container: ContainerSize,
	xAxis: AxisOptions,
	yAxis: AxisOptions,
	legend: ReChartLegend,
	isNormalized: boolean = false
): RechartDomains => {
	const showSubTotalAmount = widget.showSubTotalAmount;
	const domain = [0, value => {
		let result = 1;

		if (
			widget.dataLabels.format
			&& widget.dataLabels.format.type === AXIS_FORMAT_TYPE.DT_INTERVAL_FORMAT
		) {
			result = getNiceScaleDTInterval(value, widget.dataLabels.format);
		} else if (!isNormalized) {
			result = getNiceScale(value, showSubTotalAmount);

			if (showSubTotalAmount) {
				const diff = result - value;
				let graphHeight = container.height - (xAxis.height ?? 0);

				if (legend.align === LEGEND_ALIGN.CENTER) {
					graphHeight -= legend.height ?? 0;
				}

				const diffHeight = diff * graphHeight / result;
				const labelForSubTotalAmount = '_' + value;
				const {height} = calculateStringsSize(
					[[labelForSubTotalAmount]],
					widget.dataLabels.fontFamily,
					widget.dataLabels.fontSize
				)[0];

				if (diffHeight < height) {
					const bestValue = value + (result / graphHeight * (yAxis.width ?? 1));

					result = getNiceScale(bestValue, showSubTotalAmount);
				}
			}
		}

		return result;
	}];

	return domain;
};

export {
	getYAxisNumber,
	getYAxisDomainNiceScale,
	normalizeSeries
};
