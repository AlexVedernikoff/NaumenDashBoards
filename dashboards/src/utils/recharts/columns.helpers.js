// @flow
import type {AxisOptions, ContainerSize, RechartData} from './types';
import type {AxisWidget} from 'store/widgets/data/types';
import {calculateStringsSize, getNiceScale, getRechartAxisSetting} from './helpers';
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

const getYAxisNumber = (
	widget: AxisWidget,
	container: ContainerSize,
	xAxis: {height?: number},
	legend: {align: $Values<typeof LEGEND_ALIGN>, height?: number},
	data: DiagramBuildData,
	formatter: ValueFormatter,
	axisName: string = '',
	isNormalized: boolean = false
): AxisOptions => {
	const settings = getRechartAxisSetting(widget.indicator);
	const formattedSeries = data.series.flatMap(el => el.data.map(val => formatter(val)));
	const maxValueLength = Math.max(...formattedSeries.map(val => String(val).length), 0);
	const maxString = Array(maxValueLength + 1).fill('0').join('');
	const sizes = calculateStringsSize([[maxString], [axisName]], settings.fontFamily, settings.fontSize);
	let width = sizes[0]?.width ?? 0;

	if (settings.showName) {
		width += (sizes[1]?.height ?? 0);
	}

	const showSubTotalAmount = widget.showSubTotalAmount;
	const domain = [0, value => {
		let result = 1;

		if (!isNormalized) {
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
					const bestValue = value + (result / graphHeight * width);

					result = getNiceScale(bestValue, showSubTotalAmount);
				}
			}
		}

		return result;
	}];

	return {...settings, axisName, domain, width};
};

export {
	getYAxisNumber,
	normalizeSeries
};
