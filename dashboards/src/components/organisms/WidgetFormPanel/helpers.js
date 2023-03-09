// @flow
import {SORTING_OPTIONS} from 'WidgetFormPanel/components/SortingBox/constants';
import type {SortingValueOption} from 'WidgetFormPanel/components/SortingBox/types';
import {SORTING_VALUES} from 'store/widgets/data/constants';

/**
 * Возвращает составной ключ ошибки валидации
 * @param {Array<string>} keys - ключи в порядке вложенности
 * @returns {string}
 */
const getErrorPath = (...keys: Array<string | number>): string => {
	let errorKey = keys.splice(0, 1)[0].toString();

	keys.forEach(key => {
		errorKey += typeof key === 'string' ? `.${key}` : `[${key}]`;
	});

	return errorKey;
};

/**
 * Возвращает набор опций значений сортировки в зависимости от данных виджета
 * @param {boolean} disabledDefault - указывает на необходимость дизейбла дефолтной опции
 * @returns {Array<SortingValueOption>}
 */
const getSortingOptions = (disabledDefault: boolean): Array<SortingValueOption> =>
	SORTING_OPTIONS.map(option =>
		option.value === SORTING_VALUES.DEFAULT
			? {...option, disabled: disabledDefault}
			: option
	);

export {
	getErrorPath,
	getSortingOptions
};
