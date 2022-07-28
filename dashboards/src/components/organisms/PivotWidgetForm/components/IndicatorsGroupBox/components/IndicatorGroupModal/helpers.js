// @flow
import {deepClone} from 'helpers';
import type {GroupIndicatorInfo, IndicatorGrouping} from 'store/widgets/data/types';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import t from 'localization';
import uuid from 'tiny-uuid';

/**
 * Получает все индикаторы из дерева с выставленной отметкой
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @returns {IndicatorGrouping} - плоский список отмеченных индикаторов
 */
const getChecked = (value: IndicatorGrouping): IndicatorGrouping => {
	const getCheckedInner = (value: IndicatorGrouping, accumulator: IndicatorGrouping) => {
		value.forEach(indicator => {
			if (indicator.checked) {
				accumulator.push(indicator);
			}

			if (indicator.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO && indicator.children) {
				getCheckedInner(indicator.children, accumulator);
			}
		});
	};

	const accumulator = [];

	getCheckedInner(value, accumulator);

	return accumulator;
};

/**
 * Удаляет индикаторы из дерева
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @param {IndicatorGrouping} elements - элементы для удаления
 * @returns {IndicatorGrouping} - новое дерево без элементов
 */
const removeElementsFromIndicatorGrouping = (value: IndicatorGrouping, elements: IndicatorGrouping): IndicatorGrouping => {
	const result = [];
	const elementsKeys = elements.map(item => item.key);

	value.forEach(item => {
		if (!elementsKeys.includes(item.key)) {
			let addElement = item;

			if (item.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO && item.children) {
				addElement = {
					...item,
					children: removeElementsFromIndicatorGrouping(item.children, elements)
				};
			}

			result.push(addElement);
		}
	});

	return result;
};

/**
 * Выделяет отмеченные элементы в новую группу
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @returns {IndicatorGrouping} - новое дерево с новой группой
 */
const extractCheckedToNewGroup = (value: IndicatorGrouping): IndicatorGrouping => {
	const checkedElements = getChecked(value);
	const children: IndicatorGrouping = [];

	checkedElements.forEach(element => {
		if (element.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO) {
			children.push({...element, checked: false});
		} else if (element.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO) {
			children.push({...element, checked: false});
		}
	});

	const newGroup: GroupIndicatorInfo = {
		checked: false,
		children,
		hasSum: false,
		key: uuid(),
		label: t('PivotWidgetForm::IndicatorsGroupBox::NewGroup'),
		type: INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO
	};

	const newValues = removeElementsFromIndicatorGrouping(deepClone(value), checkedElements);

	newValues.push(newGroup);

	return newValues;
};

export {
	getChecked,
	extractCheckedToNewGroup
};
