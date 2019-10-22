// @flow
import type {OptionType} from 'react-select/src/types';

/**
 * Создаем имя в соответсвии с порядковым номером (комбо график)
 * @param {number} number - номер набора инпутов
 * @returns {string}
 */
const createOrderName = (number: number) => (name: string) => `${name}_${number}`;

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

export {
	createOrderName,
	getNumberFromName,
	getValue
};
