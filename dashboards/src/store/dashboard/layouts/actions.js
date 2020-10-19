// @flow
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {filterLayouts, getLegacyLayouts} from './helpers';
import {getMapValues} from 'src/helpers';
import {getParams} from 'store/helpers';
import isMobile from 'ismobilejs';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {LayoutPayloadForChange, Layouts, LayoutsPayloadForChange} from './types';
import {LAYOUTS_EVENTS} from './constants';
import NewWidget from 'store/widgets/data/NewWidget';

/**
 * Устанавливает положения виджетов для веб представления
 * @param {Array<object>} widgets - ненормализованные виджеты
 * @param {Layouts} layouts - положения виджетов
 * @returns {ThunkAction}
 */
const setWebLayouts = (widgets: Array<Object>, layouts?: Layouts) => (dispatch: Dispatch) => {
	let widgetLayouts = layouts;

	if (!isMobile().any) {
		const legacyLayouts = getLegacyLayouts(widgets);

		if (!widgetLayouts) {
			widgetLayouts = {
				lg: legacyLayouts,
				sm: legacyLayouts.map(layout => ({...layout, w: 1}))
			};
		}

		dispatch(changeLayouts({
			layoutMode: LAYOUT_MODE.WEB,
			layouts: widgetLayouts
		}));
	}
};

/**
 * Устанавливает положения виджетов для мобильного представления
 * @param {Array<object>} widgets - ненормализованные виджеты
 * @param {Layouts} layouts - положения виджетов
 * @returns {ThunkAction}
 */
const setMobileLayouts = (widgets: Array<Object>, layouts?: Layouts) => (dispatch: Dispatch) => {
	let widgetLayouts = layouts;

	if (!widgetLayouts) {
		widgetLayouts = {
			sm: getLegacyLayouts(widgets).map(layout => ({...layout, w: 1}))
		};
	}

	dispatch(changeLayouts({
		layoutMode: LAYOUT_MODE.MOBILE,
		layouts: widgetLayouts
	}));
};

/**
 * Сохраняет изменение положения виджетов
 * @returns {ThunkAction}
 */
const saveNewLayouts = (): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	dispatch({
		type: LAYOUTS_EVENTS.REQUEST_SAVE_LAYOUTS
	});

	try {
		const {dashboard, widgets} = getState();
		const {layouts} = dashboard;
		const widgetIds = Object.keys(widgets.data.map).filter(id => id !== NewWidget.id);
		const {MOBILE, WEB} = LAYOUT_MODE;
		const payload = {
			...getParams(),
			layouts: filterLayouts(layouts[WEB], widgetIds),
			mobileLayouts: filterLayouts(layouts[MOBILE], widgetIds)
		};

		await window.jsApi.restCallModule('dashboardSettings', 'editLayouts', payload);

		dispatch({
			type: LAYOUTS_EVENTS.RESPONSE_SAVE_LAYOUTS
		});
	} catch (e) {
		dispatch({
			type: LAYOUTS_EVENTS.RECORD_SAVE_LAYOUTS_ERROR
		});
	}
};

const addLayouts = (widgetId: string) => (dispatch: Dispatch, getState: GetState) => {
	const {map} = getState().widgets.data;

	dispatch({
		payload: {
			widgetId,
			widgets: getMapValues(map)
		},
		type: LAYOUTS_EVENTS.ADD_LAYOUTS
	});
};

const changeLayout = (payload: LayoutPayloadForChange) => ({
	payload,
	type: LAYOUTS_EVENTS.CHANGE_LAYOUT
});

const replaceLayoutsId = (from: string, to: string) => ({
	payload: {
		from,
		to
	},
	type: LAYOUTS_EVENTS.REPLACE_LAYOUTS_ID
});

const changeLayouts = (payload: LayoutsPayloadForChange) => ({
	payload,
	type: LAYOUTS_EVENTS.CHANGE_LAYOUTS
});

const removeLayouts = (payload: string) => ({
	payload,
	type: LAYOUTS_EVENTS.REMOVE_LAYOUTS
});

export {
	addLayouts,
	changeLayout,
	changeLayouts,
	removeLayouts,
	replaceLayoutsId,
	setMobileLayouts,
	saveNewLayouts,
	setWebLayouts
};
