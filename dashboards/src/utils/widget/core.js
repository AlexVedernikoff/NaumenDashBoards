// @flow
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {OptionType} from 'react-select/src/types';
import type {Widget} from 'store/widgets/data/types';

/**
 * Создаем имя в соответсвии с порядковым номером (комбо график)
 * @param {string} name - базовое название поля
 * @param {number} number - номер набора инпутов
 * @returns {string}
 */
const createOrdinalName = (name: string, number: number) => `${name}_${number}`;

/**
 * Получает порядковый номер из ключа свойства виджета
 * @param {string} name - ключ свойства виджета
 * @returns {number}
 */
const getNumberFromName = (name: string) => Number(name.split('_').pop());

/**
 * Получает значение опции свойства виджета в случае его существованиия
 * @param {OptionType | null} option - значение свойства
 * @returns {string | null}
 */
const getValue = (option: OptionType | null) => option ? option.value : null;

/**
 * Функция создает название зависимого поля
 * @param {string} targetName - название главного поля
 * @param {string} baseRefName - базовое название зависимого поля
 * @returns {string}
 */
const createRefName = (targetName: string, baseRefName: string) => {
	const number = getNumberFromName(targetName);
	return isNaN(number) ? baseRefName : createOrdinalName(baseRefName, number);
};

/**
 * Функция возвращает номер полей, по которым происходит построение
 * @param {Widget} widget - объект виджета
 * @returns {number}
 */
const getMainOrdinalNumber = (widget: Widget) => {
	const {order} = widget;
	let mainNumber = order[0];

	order.every(number => {
		if (!widget[createOrdinalName(FIELDS.sourceForCompute, number)]) {
			mainNumber = number;
			return false;
		}

		return true;
	});

	return mainNumber;
};

export {
	createOrdinalName,
	createRefName,
	getNumberFromName,
	getMainOrdinalNumber,
	getValue
};
