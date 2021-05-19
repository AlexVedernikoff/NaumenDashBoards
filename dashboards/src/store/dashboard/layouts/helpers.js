// @flow
import {deepClone} from 'helpers';
import {DEFAULT_WIDGET_LAYOUT_SIZE} from './constants';
import {GRID_PROPS} from 'components/organisms/WidgetsGrid/constants';
import type {
	Layout,
	LayoutPayloadForChange,
	Layouts,
	LayoutsPayloadForAdd,
	LayoutsPayloadForChange,
	LayoutsState,
	ReplaceLayoutsIdPayload,
	WidgetLayoutPosition
} from './types';
import type {LayoutBreakpoint, LayoutMode} from 'store/dashboard/settings/types';
import {LAYOUT_BREAKPOINTS, LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {Widget} from 'store/widgets/data/types';

/**
 * Возвращает последнюю высоту по оси Y относительно всех остальных виджетов
 * @param {Array<Layout>} layouts - массив положений виджетов
 * @param {Array<string>} whitelist - список идентификаторов виджетов, которые нужно использовать для вычисления
 * @returns {number}
 */
const getLastY = (layouts: Array<Layout>, whitelist?: Array<string>): number => {
	let computationLayouts = layouts;

	if (whitelist) {
		computationLayouts = layouts.filter(({i}) => whitelist.includes(i));
	}

	return Math.max(...computationLayouts.map(({h, y}) => y + h), 0);
};

/**
 * Создает экземпляр положения виджета
 * @param {string} i - уникальный идентификатор
 * @param {number} x - позиция по оси X
 * @param {number} y - позиция по оси Y
 * @param {number} w - ширина виджета
 * @returns {Layout}
 */
const createLayout = (i: string, x: number = 0, y: number = 0, w: number = DEFAULT_WIDGET_LAYOUT_SIZE.w): Layout => ({
	h: DEFAULT_WIDGET_LAYOUT_SIZE.h,
	i,
	w,
	x,
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
const getLegacyLayouts = (widgets: Array<Object>): Array<Layout> => {
	const layouts = widgets.map(widget => widget.layout).filter(layout => !!layout);

	return widgets.map(widget => {
		const {id, layout} = widget;

		return layout || createLayout(id, 0, getLastY(layouts));
	});
};

/**
 * Расчет позиции добавления виджета по сетке
 * @param {LayoutsState} state - состояние положений виджетов
 * @param {Array<Widget>} widgets - список виджетоов
 * @param {LayoutMode} layoutMode - режим отображения сетки
 * @param {LayoutBreakpoint} breakpoint - режим ширины сетки
 * @param {WidgetLayoutPosition | null} widgetPosition - запрашиваемая позиция виджета
 * @returns {object} - позиция в тезаданой сетке
 */
const generatePosition = (
	state: LayoutsState,
	widgets: Array<Widget>,
	layoutMode: LayoutMode,
	breakpoint: LayoutBreakpoint,
	widgetPosition: ?WidgetLayoutPosition
): {x: number, y: number} => {
	if (widgetPosition && widgetPosition.breakpoint === breakpoint && widgetPosition.layoutMode === layoutMode) {
		return widgetPosition;
	} else {
		const layouts = state[layoutMode];
		const {MOBILE, WEB} = LAYOUT_MODE;
		const inverseLayoutMode = layoutMode === WEB ? MOBILE : WEB;
		const widgetsIds = widgets.filter(widget => widget.displayMode !== inverseLayoutMode).map(widget => widget.id);
		const y = getLastY(layouts[breakpoint], widgetsIds);
		return {x: 0, y};
	}
};

/**
 * Добавляет новое положение виджета
 * @param {LayoutsState} state - состояние положений виджетов
 * @param {LayoutsPayloadForAdd} payload - параметры добавления виджета в сетку
 * @returns {LayoutsState}
 */
const addLayouts = (state: LayoutsState, payload: LayoutsPayloadForAdd): LayoutsState => {
	const {widgetId, widgetPosition, widgets} = payload;
	const {MOBILE, WEB} = LAYOUT_MODE;
	const {LG, SM} = LAYOUT_BREAKPOINTS;
	const webLgPosition = generatePosition(state, widgets, WEB, LG, widgetPosition);
	const webSmPosition = generatePosition(state, widgets, WEB, SM, widgetPosition);
	const mobileSmPosition = generatePosition(state, widgets, MOBILE, SM, widgetPosition);

	return {
		...state,
		[MOBILE]: {
			[SM]: [...state[MOBILE][SM], createLayout(widgetId, mobileSmPosition.x, mobileSmPosition.y, GRID_PROPS[MOBILE].cols[SM])]
		},
		[WEB]: {
			[LG]: [...state[WEB][LG], createLayout(widgetId, webLgPosition.x, webLgPosition.y)],
			[SM]: [...state[WEB][SM], createLayout(widgetId, webSmPosition.x, webSmPosition.y, GRID_PROPS[WEB].cols[SM])]
		}
	};
};

/**
 * Изменяет данные положения и размеров виджета
 * @param {LayoutsState} state - состояние положений виджетов
 * @param {LayoutPayloadForChange} payload - данные для изменения положений
 * @returns {LayoutsState}
 */
const changeLayout = (state: LayoutsState, payload: LayoutPayloadForChange): LayoutsState => {
	const {layout: newLayout, layoutMode} = payload;
	const layouts = state[layoutMode];
	const netLayouts = {};

	Object.keys(layouts).forEach(breakpoint => {
		netLayouts[breakpoint] = layouts[breakpoint]
			.map(layout => layout.i === newLayout.i ? {...layout, ...newLayout} : layout);
	});

	return {
		...state,
		// $FlowFixMe
		[layoutMode]: netLayouts
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
	const layouts = deepClone(state[layoutMode]);

	Object.keys(newLayouts).forEach(breakpoint => {
		if (Array.isArray(newLayouts[breakpoint])) {
			newLayouts[breakpoint].forEach(newLayout => {
				const index = layouts[breakpoint].findIndex(l => l.i === newLayout.i);

				if (index > -1) {
					layouts[breakpoint][index] = {...layouts[breakpoint][index], ...newLayout};
				} else {
					layouts[breakpoint].push(newLayout);
				}
			});
		}
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
		/*
			Клонирование необходимо, т.к. библиотека react-grid-layout сохраняет у себя в state данный объект
			и в дальнейшем производит сравнение относительно него.
		 */
		const layouts = deepClone(state[mode]);

		Object.keys(layouts).forEach(breakpoint => {
			layouts[breakpoint] = layouts[breakpoint].filter(layout => layout.i !== widgetId);
		});

		state[mode] = layouts;
	});

	return state;
};

export {
	addLayouts,
	changeLayout,
	changeLayouts,
	createLayout,
	filterLayouts,
	getLastY,
	getLegacyLayouts,
	removeLayouts,
	replaceLayoutsId
};
