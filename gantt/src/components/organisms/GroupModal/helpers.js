// @flow
import type {AndCondition, OrCondition, SubGroup} from 'GroupModal/types';
import type {Attribute} from 'store/sources/attributes/types';

/**
 * Создает новое условие ИЛИ
 * @returns {OrCondition}
 */
const createNewOrCondition = (): OrCondition => ({
	type: ''
});

/**
 * Создает новое условие И
 * @returns {AndCondition}
 */
const createNewAndCondition = (): AndCondition => [createNewOrCondition()];

/**
 * Создает новую подгруппу
 * @returns {SubGroup}
 */
const createNewSubGroup = (): SubGroup => ({
	data: [createNewAndCondition()],
	name: ''
});

/**
 * Создает тип пользовательской группировки для ссылочного атрибута
 * @param {Attribute} attribute - атрибут
 * @param {string} property - свойства которое нужно использовать, для создания уникальности
 * @returns {string}
 */
const createRefObjectCustomGroupType = (attribute: Attribute, property: 'metaClassFqn' | 'property'): string => {
	return `${attribute.type}$${attribute[property]}`;
};

export {
	createRefObjectCustomGroupType,
	createNewAndCondition,
	createNewOrCondition,
	createNewSubGroup
};
