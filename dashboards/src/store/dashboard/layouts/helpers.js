// @flow
import {deepClone} from 'src/helpers';
import {GRID_PROPS} from 'components/organisms/DashboardContent/constants';
import type {Layout, Layouts, LayoutsPayloadForChange, LayoutsState, ReplaceLayoutsIdPayload} from './types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {Widget} from 'store/widgets/data/types';

/**
 * Возвращает последнюю высоту по оси Y относительно всех остальных виджетов
 * @param {Array<Layout>} layouts - массив положений виджетов
 * @returns {number}
 */
const getLastY = (layouts: Array<Layout>): number => Math.max(...layouts.map(({h, y}) => y + h), 0);

/**
 * Создает экземпляр положения виджета
 * @param {string} i - уникальный идентификатор
 * @param {number} y - высота по оси Y
 * @param {number} w - ширина виджета
 * @returns {Layout}
 */
const createLayout = (i: string, y: number, w: number = 4): Layout => ({
	h: 4,
	i,
	w,
	x: 0,
	y
});

/**
 * Отфильтровывает лишние данные положений виджетов
 * @param {Layouts} layouts - положения виджетов
 * @param {Array<string>} widgetIds - идентификаторы виджетов, которые должны остаться в объекте положений
 * @returns {Layouts}
 */
const filterLayouts = (layouts: Layouts, widgetIds: Array<string>): Layouts => {
	const filteredLayouts = deepClone(layouts);

	Object.keys(filteredLayouts).forEach(breakpoint => {
		filteredLayouts[breakpoint] = filteredLayouts[breakpoint].filter(layout => widgetIds.includes(layout.i));
	});

	return filteredLayouts;
};

/**
 * Формирует из отдельных виджетов общий массив положений
 * @param {Array<Widget>} widgets - массив виджетов
 * @returns {Array<Layout>}
 */
const getLegacyLayouts = (widgets: Array<Object>): Array<Layout> => widgets.map(widget => {
	const {id, layout} = widget;
	const existsLayouts = widgets.map(widget => widget.layout).filter(layout => !!layout);
	const y = getLastY(existsLayouts);

	return layout || createLayout(id, y);
});

/**
 * Добавляет новое положение виджета
 * @param {LayoutsState} state - состояние положений виджетов
 * @param {string} widgetId - идентификатор виджета
 * @returns {LayoutsState}
 */
const addLayouts = (state: LayoutsState, widgetId: string): LayoutsState => {
	const {MOBILE, WEB} = LAYOUT_MODE;
	const {[MOBILE]: mobileLayouts, [WEB]: webLayouts} = state;

	return {
		...state,
		[MOBILE]: {
			sm: [...state[MOBILE].sm, createLayout(widgetId, getLastY(mobileLayouts.sm), GRID_PROPS[MOBILE].cols.sm)]
		},
		[WEB]: {
			lg: [...state[WEB].lg, createLayout(widgetId, getLastY(webLayouts.lg))],
			sm: [...state[WEB].sm, createLayout(widgetId, getLastY(webLayouts.sm), GRID_PROPS[WEB].cols.sm)]
		}
	};
};

/**
 * Изменяет текущее положение виджетов
 * @param {LayoutsState} state - состояние положений виджетов
 * @param {LayoutsPayloadForChange} payload - данные для изменения положений
 * @returns {LayoutsState}
 */
const changeLayouts = (state: LayoutsState, payload: LayoutsPayloadForChange): LayoutsState => {
	const {layoutMode, layouts: newLayouts} = payload;
	const layouts = state[layoutMode];

	Object.keys(newLayouts).forEach(breakpoint => {
		newLayouts[breakpoint].forEach(newLayout => {
			const index = layouts[breakpoint].findIndex(l => l.i === newLayout.i);

			if (index > -1) {
				layouts[breakpoint][index] = {...layouts[breakpoint][index], ...newLayout};
			} else {
				layouts[breakpoint].push(newLayout);
			}
		});
	});

	return {
		...state,
		// $FlowFixMe
		[layoutMode]: layouts
	};
};

/**
 * Заменяет идентификатор виджета
 * @param {LayoutsState} state - состояние положений виджетов
 * @param {ReplaceLayoutsIdPayload} payload - данные для замены идентификатора
 * @returns {LayoutsState}
 */
const replaceLayoutsId = (state: LayoutsState, payload: ReplaceLayoutsIdPayload): LayoutsState => {
	const {from, to} = payload;

	Object.keys(LAYOUT_MODE).forEach(mode => {
		const layouts = deepClone(state[mode]);

		Object.keys(layouts).forEach(breakpoint => {
			layouts[breakpoint].forEach(layout => {
				if (layout.i === from) {
					layout.i = to;
				}
			});

			state[mode] = layouts;
		});
	});

	return state;
};

/**
 * Удаляет положение виджета
 * @param {LayoutsState} state - состояние положений виджетов
 * @param {string} widgetId - идентификатор виджета
 * @returns {LayoutsState}
 */
const removeLayouts = (state: LayoutsState, widgetId: string): LayoutsState => {
	Object.keys(LAYOUT_MODE).forEach(mode => {
		const layouts = state[mode];

		Object.keys(layouts).forEach(breakpoint => {
			layouts[breakpoint] = layouts[breakpoint].filter(layout => layout.i !== widgetId);
		});

		state[mode] = layouts;
	});

	return state;
};

export {
	addLayouts,
	changeLayouts,
	createLayout,
	filterLayouts,
	getLastY,
	getLegacyLayouts,
	removeLayouts,
	replaceLayoutsId
};