// @flow
import {Attribute} from 'store/attributes/types';
import {ResourceSetting} from 'store/App/types';
import {store} from 'app.constants';

/**
 * Получаем родителя у ребенка
 * @returns {ResourceSetting}
 * @param indexChild - индекс ребенка
 * @param levelChild - уровень (глубина) ребенка
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
 * Получаем ближайшего соседа с такой же глубиной (уровнем)
 * @returns {ResourceSetting}
 * @param index - индекс
 * @param level - уровень (глубина)
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
 * Получаем ближайшего соседа без учета глубины (уровня)
 * @returns {ResourceSetting}
 * @param index - индекс
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
 */
export const copyWithExclusion = (target: Object, exclusions: Array<string>) => {
	const newValue = {...target};

	exclusions.forEach(exc => delete newValue[exc]);

	return newValue;
};

/**
 * Получаем classFqn
 * @returns {string}
 * @param parentId - id объекта
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
 * Изменение указанного элемента на новый
 * @returns {string}
 * @param array - массив
 * @param el - объект, который нужно изменить
 * @param index - индекс объекта
 */
export const updateElementInArray = (array, el, index): Array<Object> => [...array.slice(0, index), el, ...array.slice(index + 1)];

/**
 * Получаем новый уровень вложенности в зависимости от значения чекбокса.
 * Новый уровень зависит от старого значения - если isNested, то добавляем 1.
 * Если !isNested, то из старого уровня вычитается 1.
 * @returns {number}
 * @param oldLevel - старый уровень объекта
 * @param isNested - значение чекбокса - является ли данный объект вложенным
 */
export const getUpdatedLevel = (oldLevel: number, isNested: boolean): number => oldLevel + (1 - 2 * (isNested ? 0 : 1));

/**
 * Получаем размер отступа для объекта в зависимости от его уровня вложенности
 * @returns {string}
 * @param level - уровень вложенности (глубины)
 */
export const getPaddingLeftForChildren = (level: number): Object => ({'paddingLeft': `${level * 36}px`});
