// @flow
import {DEFAULT_COLS_COUNT, GRID_PROPS, gridRef} from './constants';
import {DEFAULT_WIDGET_LAYOUT_SIZE} from 'store/dashboard/layouts/constants';
import type {Layout, WidgetLayoutPosition} from 'store/dashboard/layouts/types';
import type {LayoutBreakpointsData, LayoutMode} from 'store/dashboard/settings/types';

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

/**
 * Формирует узкий макет из широкого
 * @param {Layout[]} layouts - широкий макет
 * @param {Layout[][]} oldLayouts - старый узкий макет
 * @returns  {Layout[]} - новый узкий макет
 */
const generateWebSMLayout = (layouts: Layout[], oldLayouts: ?Layout[]): Layout[] => {
	if (layouts && layouts.length > 0) {
		const heights = {};
		const result = [];

		layouts.forEach(({h, i}) => {
			heights[i] = h;
		});
		oldLayouts && oldLayouts.forEach(({h, i}) => {
			heights[i] = h;
		});

		let top = 0;
		const widgetIdsByPosition = layouts.map(({i, x, y}) => ({i, pos: y * 100 + x}));

		widgetIdsByPosition.sort(({pos: first}, {pos: second}) => first - second);
		widgetIdsByPosition.forEach(({i}) => {
			const h = (i in heights) ? heights[i] : DEFAULT_WIDGET_LAYOUT_SIZE.h;

			result.push({ h, i, w: 1, x: 0, y: top });
			top += h;
		});

		return result;
	}

	return oldLayouts ?? [];
};

/**
 * Сравнивает 2 макета
 * @param {Layout[]} firstLayouts - первый макет
 * @param {Layout[]} secondLayouts - второй макет
 * @returns  {boolean}
 */
const isEqualsLayouts = (firstLayouts: ?Layout[], secondLayouts: ?Layout[]): boolean => {
	if (!firstLayouts || !secondLayouts || firstLayouts.length !== secondLayouts.length) {
		return false;
	}

	return firstLayouts.every((firstLayout) => {
		const secondLayout = secondLayouts.find(({i}) => i === firstLayout.i);
		return secondLayout
			&& firstLayout.h === secondLayout.h
			&& firstLayout.w === secondLayout.w
			&& firstLayout.x === secondLayout.x
			&& firstLayout.y === secondLayout.y;
	});
};

/**
 * Расчитывает позицию клика по параметрам сетки
 * @param {LayoutMode} layoutMode - режим отображения дашборда (веб/мобильный)
 * @param {LayoutBreakpointsData<number>} breakpoints - список режимов сетки по ширине элемента
 * @param {LayoutBreakpointsData<number>} colsCount - количество колонок в зависисмости от режима сетки
 * @param {number} rowHeight - высота строки сетки
 * @param {number} width - ширина элемента сетки
 * @param {number} mouseX - X координата клика
 * @param {number} mouseY - Y координата клика
 * @returns {WidgetLayoutPosition} - расчетное положение клика
 */
const calculatePosition = (
	layoutMode: LayoutMode,
	breakpoints: LayoutBreakpointsData<number>,
	colsCount: LayoutBreakpointsData<number>,
	rowHeight: number,
	width: number,
	mouseX: number,
	mouseY: number
): ?WidgetLayoutPosition => {
	const keys = Object.keys(breakpoints).sort((bp1, bp2) => breakpoints[bp1] - breakpoints[bp2]);
	const breakpoint = keys.find((breakpoint, idx) => {
		const nextBreakpoint = keys[idx + 1];
		return (nextBreakpoint === undefined
			|| (breakpoints[breakpoint] <= width && width <= breakpoints[nextBreakpoint]));
	}) ?? keys[0];

	if (breakpoint in colsCount) {
		const colWidth = width / colsCount[breakpoint];
		const x = Math.trunc(mouseX / colWidth);
		const y = Math.trunc(mouseY / rowHeight);

		return {breakpoint, layoutMode, x, y};
	}

	return null;
};

export {
	getCountGridColumns,
	generateWebSMLayout,
	isEqualsLayouts,
	calculatePosition
};
