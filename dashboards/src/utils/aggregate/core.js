// @flow
import {AGGREGATE_SELECTS} from './selects';
import type {AggregatedData, NumbersYData, MixedYData, XAxis, YAxis} from './types';
import type {Attribute} from 'store/sources/attributes/types';
import {DEFAULT_VARIANTS, INTEGER_TYPE, INTEGER_VARIANTS} from './constansts';
import type {GroupedData} from 'utils/group/types';
import type {OptionType} from 'react-select/src/types';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';

/**
 * Получаем общее кол-во элементов
 * @param {MixedYData | NumbersYData} data - массив значений по y относительно x
 * @returns {number}
 */
const count = (data: MixedYData | NumbersYData): number => data.length;

/**
 * Получаем процентное отношение
 * @param {NumbersYData} data - массив значений по y относительно x
 * @param {number} max - максимальное кол-во значений всех данных
 * @returns {number}
 */
const percent = (data: NumbersYData, max: number): number => Math.round(count(data) / max * 100);

/**
 * Получаем сумму
 * @param {NumbersYData} data - массив значений по y относительно x
 * @returns {*}
 */
const sum = (data: NumbersYData): number => data.reduce((x1, x2) => x1 + x2);

/**
 * Получаем среднее значение
 * @param {NumbersYData} data - массив значений по y относительно x
 * @returns {number}
 */
const average = (data: NumbersYData): number => Math.round(sum(data) / count(data));

/**
 * Получаем максимальное значение
 * @param {NumbersYData} data - массив значений по y относительно x
 * @returns {number}
 */
const max = (data: NumbersYData): number => Math.max(...data);

/**
 * Получаем минимальное значение
 * @param {NumbersYData} data - массив значений по y относительно x
 * @returns {number}
 */
const min = (data: NumbersYData): number => Math.min(...data);

/**
 * Получаем медиану
 * @param {NumbersYData} data - массив значений по Y относительно X
 * @returns {number}
 */
const median = (data: NumbersYData) => {
	const mid = Math.floor(data.length / 2);
	const	nums = [...data].sort((a, b) => a - b);
	return data.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

/**
 * Получаем необходимую ф-цию агрегации
 * @param {string} variant - метод агрегаций выбранный пользователем
 * @returns {Function}
 */
const resolve = (variant: string): Function => {
	const aggregates = {
		[DEFAULT_VARIANTS.COUNT]: count,
		[DEFAULT_VARIANTS.PERCENT]: percent,
		[INTEGER_VARIANTS.SUM]: sum,
		[INTEGER_VARIANTS.AVERAGE]: average,
		[INTEGER_VARIANTS.MAX]: max,
		[INTEGER_VARIANTS.MIN]: min,
		[INTEGER_VARIANTS.MEDIAN]: median
	};

	return aggregates[variant] || count;
};

/**
 * Агрегируем данные
 * @param {string} variant - метод агрегаций выбранный пользователем
 * @param {GroupedData} data - сгруппированые данные для агрегации
 * @returns {AggregatedData}
 */
const aggregate = (variant: string, data: GroupedData): AggregatedData => {
	let xAxis: XAxis = [];
	const yAxis: YAxis = [];
	const operator = resolve(variant);

	if (operator.name === 'percent') {
		const keys = Object.keys(data);
		let max = 0;

		keys.map(key => {
			max += count(data[key]);
		});

		keys.map(key => {
			const intData = data[key].map(i => Number(i));

			xAxis.push(key);
			yAxis.push(operator(intData, max));
		});
	} else {
		Object.keys(data).map(key => {
			const intData = data[key].map(i => Number(i));
			xAxis.push(key);
			yAxis.push(operator(intData));
		});
	}

	return {
		xAxis,
		yAxis
	};
};

/**
 * Получаем необходимый набор опций в зависимости переданного атрибута
 * @param {Attribute} refValue - атрибут класса
 * @returns {SelectValue[]}
 */
const getAggregateOptions = (refValue: OptionType): SelectValue[] => {
	const {DEFAULT_SELECTS, INTEGER_SELECTS} = AGGREGATE_SELECTS;
	return refValue && refValue.type === INTEGER_TYPE ? [...INTEGER_SELECTS, ...DEFAULT_SELECTS] : DEFAULT_SELECTS;
};

export {
	getAggregateOptions
};

export default aggregate;
