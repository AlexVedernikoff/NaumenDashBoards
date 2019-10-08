// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DATETIME_FORMAT, DATETIME_VARIANTS, GROUP_TYPES} from './constansts';
import {GROUP_SELECTS} from './selects';
import type {GroupedData, RawData} from './types';
import moment from 'moment';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';

/**
 * Вовзращает день месяц
 * @param {string} strDate - строковое представление даты
 * @returns {string}
 */
const day = (strDate: string): string => moment(strDate, DATETIME_FORMAT).locale('ru').format('DD MMMM');

/**
 * Вовзращает месяц и номер недели
 * @param {string} strDate - строковое представление даты
 * @returns {string}
 */
const week = (strDate: string): string => {
	const date = moment(strDate, DATETIME_FORMAT);
	const week = Math.ceil(date.date() / 7);
	const month = date.locale('ru').format('MMMM');

	return `${month} ${week} неделя `;
};

/**
 * Вовзращает месяц
 * @param {string} strDate - строковое представление даты
 * @returns {string}
 */
const month = (strDate: string): string => moment(strDate, DATETIME_FORMAT).locale('ru').format('MMMM');

/**
 * Вовзращает год и квартал
 * @param {string} strDate - строковое представление даты
 * @returns {string}
 */
const quarter = (strDate: string): string => `${moment(strDate, DATETIME_FORMAT).format('YYYY Q')}й квартал`;

/**
 * Вовзращает год
 * @param {string} strDate - строковое представление даты
 * @returns {string}
 */
const year = (strDate: string) => moment(strDate, DATETIME_FORMAT).format('YYYY');

/**
 * Дефолтная ф-ция возращающее переданное значение (сделана для удобства реализации ф-ции resolve)
 * @param {string} x - строковое представление даты
 * @returns {string}
 */
const defaultValue = (x: string): string => x;

/**
 * Получаем необходимую ф-цию для преобразования значения оси X
 * @param {string} variant - значение группировки выбранное пользователем
 * @returns {Function}
 */
const resolve = (variant: string): Function => {
	const groups = {
		[DATETIME_VARIANTS.DAY]: day,
		[DATETIME_VARIANTS.WEEK]: week,
		[DATETIME_VARIANTS.MONTH]: month,
		[DATETIME_VARIANTS.QUARTER]: quarter,
		[DATETIME_VARIANTS.YEAR]: year
	};

	return groups[variant] || defaultValue;
};

/**
 * Группируем данные по оси X
 * @param {string} variant - значение группировки выбранное пользователем
 * @param {RawData[]} data - сырые данные графика
 * @returns {GroupedData}
 */
const group = (variant: string, data: RawData[]): GroupedData => {
	const groupData = {};
	const filter = resolve(variant);

	data.forEach(i => {
		if (i.x && i.y) {
			const y = i.y;
			const x = filter(i.x);
			groupData[x] = groupData[x] ? [...groupData[x], y] : [y];
		}
	});

	return groupData;
};

/**
 * Получаем необходимый набор опций в зависимости переданного атрибута
 * @param {Attribute} xAxis - атрибут класса
 * @returns {SelectValue[] | void}
 */
const getGroupOptions = (xAxis: Attribute | null): SelectValue[] => {
	const {DATETIME_SELECTS, DEFAULT_SELECTS, INTERVAL_SELECTS} = GROUP_SELECTS;

	if (xAxis) {
		if (xAxis.type === GROUP_TYPES.DATETIME) {
			return DATETIME_SELECTS;
		}

		if (xAxis.type === GROUP_TYPES.DT_INTERVAL) {
			return INTERVAL_SELECTS;
		}
	}

	return DEFAULT_SELECTS;
};

export {
	getGroupOptions
};

export default group;
