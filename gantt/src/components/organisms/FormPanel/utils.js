// @flow
import {Attribute} from 'store/attributes/types';
import {ResourceSetting} from 'store/App/types';
import {store} from 'app.constants';

/**
 * Получаем родителя у ребенка
 * @param indexChild - индекс ребенка
 * @param levelChild - уровень (глубина) ребенка
 * @returns {ResourceSetting}
 */
export const getParent = (indexChild: number, levelChild: number): ResourceSetting => {
	const {resources} = store.getState().APP;

	for (let i = indexChild - 1; i >= 0; i--) {
		if (resources[i].level >= levelChild) {
			continue;
		}

		return resources[i];
	}

	return null;
};

/**
 * Получаем ближайшего соседа сверху с такой же глубиной (уровнем)
 * @param index - индекс
 * @param level - уровень (глубина)
 * @returns {ResourceSetting}
 */
export const getNeighbor = (index: number, level: number): ResourceSetting => {
	const {resources} = store.getState().APP;

	for (let i = index - 1; i >= 0; i--) {
		if (resources[i].level === level) {
			return resources[i];
		}
	}

	return null;
};

/**
 * Получаем индекс ближайшего соседа снизу с такой же глубиной (уровнем)
 * @param index - индекс
 * @param level - уровень (глубина)
 * @returns {number}
 */
export const getIndexBottomNeighbor = (index: number, level: number): number => {
	const {resources} = store.getState().APP;

	for (let i = index + 1; i < resources.length; i++) {
		if (resources[i].level === level) {
			return i;
		}
	}

	return resources.length;
};

/**
 * Пропускаем всех детей
 * @param index - индекс
 * @returns {number}
 */
export const skipChildren = (index: number): number => {
	const {resources} = store.getState().APP;

	for (let i = index + 1; i < resources.length; i++) {
		if (resources[i].level <= resources[index].level) {
			return i;
		}
	}

	return resources.length;
};

/**
 * Получаем ближайшего ребенка с отличным от родителя типом
 * @param index - индекс
 * @param level - уровень (глубина)
 * @returns {ResourceSetting}
 */
export const getChild = (index: number, level: number): ResourceSetting => {
	const {resources} = store.getState().APP;

	if (index === resources.length - 1) {
		return null;
	}

	for (let i = index + 1; i < resources.length; i++) {
		if (resources[i].level > level && resources[index].type !== resources[i].type) {
			return resources[i];
		}

		if (resources[i].level <= level) {
			return null;
		}
	}

	return null;
};

/**
 * Получаем ближайшего соседа без учета глубины (уровня)
 * @param index - индекс
 * @returns {ResourceSetting}
 */
export const getPrevItem = (index: number): ResourceSetting => {
	const {resources} = store.getState().APP;
	return resources[index - 1];
};

/**
 * Обновляем объект, добавляя два новых поля
 * @param target - изначальный объекта
 * @param newLabel - значение поля label
 * @param newValue - значение поля value
 * @returns {Object}
 */
export const getAdditionalFields = (target: ResourceSetting | Attribute, newLabel: string, newValue: string) => {
	return {
		...target,
		label: newLabel,
		value: newValue
	};
};

/**
 * Обновляем объект, удаляя поля, перечисленные в exclusions
 * @param target - изначальный объекта
 * @param exclusions - массив полей, которые нужно удалить
 * @returns {Object}
 */
export const copyWithExclusion = (target: Object, exclusions: Array<string>) => {
	const newValue = {...target};

	exclusions.forEach(exc => delete newValue[exc]);

	return newValue;
};

/**
 * Получаем classFqn
 * @param parentId - id объекта
 * @returns {string}
 */
export const getParentClassFqn = (parentId: number): string => {
	if (parentId) {
		const {resources} = store.getState().APP;
		const parent = resources.find((item) => item.id === parentId);
		return parent ? parent.source?.value?.value : null;
	}

	return '';
};

/**
 * Заменяет элемент массива
 * @param array - массив
 * @param el - объект, который нужно изменить
 * @param index - индекс объекта
 * @returns {Array<Object>}
 */
export const replaceElementInArray = (array, el, index): Array<Object> => [...array.slice(0, index), el, ...array.slice(index + 1)];

/**
 * Получаем новый уровень вложенности в зависимости от значения чекбокса.
 * Новый уровень зависит от старого значения - если isNested, то добавляем 1.
 * Если !isNested, то из старого уровня вычитается 1.
 * @param oldLevel - старый уровень объекта
 * @param isNested - значение чекбокса - является ли данный объект вложенным
 * @returns {number}
 */
export const getUpdatedLevel = (oldLevel: number, isNested: boolean): number => oldLevel + (1 - 2 * (isNested ? 0 : 1));

/**
 * Получаем размер отступа для объекта в зависимости от его уровня вложенности
 * @param level - уровень вложенности (глубины)
 * @returns {Object}
 */
export const getPaddingLeftForChildren = (level: number): Object => {
	if (!level) {
		return ({'paddingLeft': '20px'});
	}

	return ({'marginLeft': `${level * 36 + 20}px`});
};
