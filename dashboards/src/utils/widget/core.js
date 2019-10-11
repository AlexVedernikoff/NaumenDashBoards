// @flow
/**
 * Создаем имя в соответсвии с порядковым номером (комбо график)
 * @param {number} number - номер набора инпутов
 * @returns {Function}
 */
const createOrderName = (number: number) => (name: string) => `${name}_${number}`;

export {
	createOrderName
};
