// @flow
import {DEFAULT_COLS_COUNT, GRID_PROPS} from './constants';
import {gridRef} from './index';
import type {LayoutMode} from 'store/dashboard/settings/types';

/**
 * Возвращает количество колонок сетки в соотвествии с текущим модом дашборда и шириной
 * @param {LayoutMode} layoutMode - мод отображения дашборда
 * @returns {number} - количество колонок сетки
 */
const getCountGridColumns = (layoutMode: LayoutMode) => {
	const {breakpoints, cols} = GRID_PROPS[layoutMode];
	const {current: grid} = gridRef;
	let count = DEFAULT_COLS_COUNT;

	if (grid) {
		const {clientWidth: width} = grid;
		const sortedKeys = Object.keys(breakpoints).sort((a, b) => (breakpoints[b] - breakpoints[a]));
		let breakpoint = sortedKeys[0];

		sortedKeys.forEach(key => {
			if (breakpoints[key] > width) {
				breakpoint = key;
			}
		});

		if (cols[breakpoint]) {
			count = cols[breakpoint];
		}
	}

	return count;
};

export {
	getCountGridColumns
};
