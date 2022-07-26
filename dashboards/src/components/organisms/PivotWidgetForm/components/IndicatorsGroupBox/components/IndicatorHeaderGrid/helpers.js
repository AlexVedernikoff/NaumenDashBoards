// @flow
import {BLOCK_HEIGHT} from './constants.js';
import type {
	CalculateColumnsCountResult,
	FindTargetResult,
	FlatIndicatorArray,
	FlatIndicatorGrouping,
	FlatIndicatorInfo
} from './types';
import type {GroupIndicatorInfo, IndicatorGrouping, IndicatorInfo} from 'store/widgets/data/types';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';

/**
 * Заменяет элемент в дереве индикаторов
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @param {GroupIndicatorInfo | IndicatorInfo} oldItem - старый элемент
 * @param {GroupIndicatorInfo | IndicatorInfo} newItem - новый элемент
 * @returns {IndicatorGrouping} - новое дерево с новым элементом
 */
function updateValueItem<T: GroupIndicatorInfo | IndicatorInfo> (value: IndicatorGrouping, oldItem: T, newItem: T): IndicatorGrouping {
	const result = [];

	value.forEach(element => {
		if (element.key === oldItem.key) {
			result.push(newItem);
		} else if (element.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO && element.children) {
			result.push({
				...element,
				children: updateValueItem(element.children, oldItem, newItem)
			});
		} else {
			result.push(element);
		}
	});

	return result;
}

/**
 * Рассчитывает количество "нижних" столбов, а также формирует
 * плоский список всех индикаторов из поддерева индикаторов
 * @param {IndicatorGrouping} value - поддерево индикаторов
 * @param {GroupIndicatorInfo | null} parent - элемент родитель поддерева
 * @param {number} offset - смещение поддерева
 * @param {number} level - глубина поддерева
 * @returns {CalculateColumnsCountResult} [return description]
 */
const calculateColumnsCountInner = (
	value: IndicatorGrouping,
	parent: ?GroupIndicatorInfo,
	offset: number,
	level: number
): CalculateColumnsCountResult => {
	let count = 0;
	const list = [];
	let currentOffset = offset;

	value.forEach(item => {
		if (item.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO) {
			const groupItem = (item: GroupIndicatorInfo);
			const addItem = {
				height: 1,
				item: groupItem,
				level,
				offset: currentOffset,
				parent,
				type: INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO,
				width: 1
			};

			if (item.children && item.children.length !== 0) {
				const {count: subCount, list: subList} = calculateColumnsCountInner(item.children, item, currentOffset, level + 1);

				addItem.width = subCount;

				list.push(addItem);
				subList.forEach(item => list.push(item));

				count += subCount;
				currentOffset += subCount;
			} else {
				list.push(addItem);
				count++;
				currentOffset++;
			}
		} else if (item.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO) {
			const addItem = {item, level: 0, offset: currentOffset, parent, type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO, width: 1};

			list.push(addItem);

			count++;
			currentOffset++;
		}
	});

	return {count, list};
};

/**
 * Рассчитывает количество "нижних" столбов, а также формирует
 * плоский список всех индикаторов
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @returns  {CalculateColumnsCountResult} - количество столбцов и "плоского" списка столбцов
 */
const calculateColumnsCount = (value: IndicatorGrouping): CalculateColumnsCountResult => {
	let {count, list} = calculateColumnsCountInner(value, null, 0, 0);

	if (list.some(({type}) => type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO)) {
		const indicatorLevel = Math.max(...list.map(({level}) => level)) + 1;
		const updatingList: FlatIndicatorArray = [];

		list.forEach(item => {
			if (item.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO) {
				updatingList.push({...item, level: indicatorLevel});
			} else if (
				item.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO
				&& (
					!item.item.children
					|| item.item.children.length === 0
					|| item.item.children.every(item => item.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO)
				)
			) {
				updatingList.push({...item, height: indicatorLevel - item.level});
			} else {
				updatingList.push(item);
			}
		});

		list = updatingList;
	}

	return {count, list};
};

/**
 * Рассчитывает глубину по координате y
 * @param {FlatIndicatorArray} list - плоский список индикаторов
 * @param {number} y - координата y
 * @returns {number} - глубина
 */
const calcLevel = (list: FlatIndicatorArray, y: number): number => {
	let result = 0;

	if (y > 0) {
		result = Math.trunc(y / BLOCK_HEIGHT);

		const maxLevel = Math.max(...list.map(({level}) => level));

		if (result > maxLevel) {
			result = maxLevel;
		}
	}

	return result;
};

/**
 * Рассчитывает смешение по координате x и ширине элемента
 * @param {FlatIndicatorArray} list - плоский список индикаторов
 * @param {number} x - координата x
 * @param {number} itemWidth - ширина элемента
 * @returns {number} - смещение
 */
const calcOffset = (list: FlatIndicatorArray, x: number, itemWidth: number): number => {
	let result = 0;

	if (x > 0) {
		result = Math.trunc(x / itemWidth);

		const maxOffset = Math.max(...list.map(({offset}) => offset));

		if (result > maxOffset) {
			result = maxOffset;
		}
	}

	return result;
};

/**
 * Осуществляет поиск целевого элемента по координатам
 * @param {FlatIndicatorArray} list - плоский список индикаторов
 * @param {number} itemWidth - ширина элемента
 * @param {number} x - координата x
 * @param {number} y - координата y
 * @returns  {FindTargetResult} - информация о целевом элементе
 */
const findTarget = (list: FlatIndicatorArray, itemWidth: number, x: number, y: number): FindTargetResult => {
	const level = calcLevel(list, y);
	const offset = calcOffset(list, x, itemWidth);

	const target = list.find(
		item => {
			const {level: itemLevel, offset: itemOffset} = item;
			let height = 1;
			let width = 1;

			if (item.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO) {
				({height = 1, width = 1} = item);
			}

			return (itemLevel <= level && level < itemLevel + height)
				&& (itemOffset <= offset && offset < itemOffset + width);
		}
	) ?? null;

	return {level, offset, target};
};

/**
 * Удаляет группу, заданную в плоском формате, и переносит все
 * содержащиеся элементы в вышестоящую группу
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @param {FlatIndicatorGrouping} group - группа, заданная в плоском формате
 * @returns {IndicatorGrouping} - новое дерево индикаторов
 */
const deleteFlatGroup = (value: IndicatorGrouping, group: FlatIndicatorGrouping): IndicatorGrouping => {
	let newValue = [...value];

	if (group.parent) {
		const {item, parent} = group;
		const children = (parent.children ?? []).filter(child => child !== item);

		if (item.children) {
			item.children.forEach(child => children.push(child));
		}

		const newParent = {...parent, children};

		newValue = updateValueItem(newValue, parent, newParent);
	} else {
		const {item} = group;

		newValue = newValue.filter(child => child !== item);

		if (item.children) {
			item.children.forEach(child => newValue.push(child));
		}
	}

	return newValue;
};

/**
 * Перемещает элемент item на место target
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @param {FlatIndicatorInfo | FlatIndicatorGrouping} item - перемещаемый элемент
 * @param {FlatIndicatorGrouping | FlatIndicatorInfo | null} target - целевой элемент
 * @returns {IndicatorGrouping} - новое дерево индикаторов
 */
const sortingFlatIndicator = (
	value: IndicatorGrouping,
	item: FlatIndicatorInfo | FlatIndicatorGrouping,
	target: ?(FlatIndicatorGrouping | FlatIndicatorInfo)
): IndicatorGrouping => {
	const result = [...value];
	const items = item.parent?.children ?? value;
	const clearItems = items.filter(el => el !== item.item);
	const index = clearItems.findIndex(item => target?.item === item);

	if (index !== -1) {
		const resortItems = [...clearItems.slice(0, index), item.item, ...clearItems.slice(index)];

		if (item.parent) {
			item.parent.children = resortItems;

			return [...value];
		} else {
			return resortItems;
		}
	}

	return result;
};

/**
 * Ищет элемент в IndicatorGrouping по ключу
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @param {string} key - ключ индикатора
 * @returns {GroupIndicatorInfo | IndicatorInfo | null} - индикатор
 */
const findIndicatorByKey = (value: IndicatorGrouping, key: string): GroupIndicatorInfo | IndicatorInfo | null => {
	let result = null;

	value.forEach(item => {
		if (!result) {
			if (item.key === key) {
				result = item;
			} else if (item.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO && item.children) {
				result = findIndicatorByKey(item.children, key);
			}
		}
	});

	return result;
};

/**
 * Изменяет родителя у item на target
 * @param {IndicatorGrouping} value - дерево индикаторов
 * @param {FlatIndicatorInfo | FlatIndicatorGrouping} flatItem - перемещаемый элемент
 * @param {FlatIndicatorGrouping} target - целевая группа
 * @returns {IndicatorGrouping} - новое дерево индикаторов
 */
const changeParentForFlatIndicator = (
	value: IndicatorGrouping,
	flatItem: FlatIndicatorInfo | FlatIndicatorGrouping,
	target: FlatIndicatorGrouping
): IndicatorGrouping => {
	let newValue = [...value];
	const {item, parent} = flatItem;

	// Очищаем родителя от элемента
	if (parent) {
		const clearItems = (parent.children?.filter(el => el.key !== item.key)) ?? [];
		const newParent = {...parent, children: clearItems};

		newValue = updateValueItem(newValue, parent, newParent);
	} else {
		// родителя нет
		const clearItems = newValue.filter(el => el !== item);

		newValue = clearItems;
	}

	// Добавляем элемент в target
	const targetItem = findIndicatorByKey(newValue, target.item.key);

	if (targetItem && targetItem.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO) {
		const newTargetItem = {
			...targetItem,
			children: [...(targetItem.children ?? []), item]
		};

		newValue = updateValueItem(newValue, targetItem, newTargetItem);
	}

	return newValue;
};

/**
 * Рассчитывает высоту у плоского списка индикаторов
 * @param {FlatIndicatorArray} list - плоский список индикаторов
 * @returns {number}
 */
const calculateHeight = (list: FlatIndicatorArray) => {
	const levels = list.map(element => element.level);
	const maxLevel = Math.max(...levels);
	return (maxLevel + 1) * BLOCK_HEIGHT;
};

export {
	calculateColumnsCount,
	calculateHeight,
	changeParentForFlatIndicator,
	deleteFlatGroup,
	findTarget,
	sortingFlatIndicator,
	updateValueItem
};
