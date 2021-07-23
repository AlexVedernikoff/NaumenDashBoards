// @flow
import type {CustomChartColorsSettingsData} from 'store/widgets/data/types';
import type {Dispatch, ThunkAction} from 'store/types';
import {EVENTS} from './constants';
import {getParams} from 'store/helpers';

/**
 * Сохраняет настройки
 * @param {CustomChartColorsSettingsData} colorsSettings - настройки
 * @returns {ThunkAction}
 */
const saveCustomChartColorsSettings = (colorsSettings: CustomChartColorsSettingsData): ThunkAction => async (dispatch: Dispatch) => {
	const {key} = colorsSettings;

	dispatch({
		payload: key,
		type: EVENTS.SAVE_PENDING
	});

	try {
		const request = {
			...getParams(),
			colorsSettings
		};

		await window.jsApi.restCallModule('dashboardSettings', 'saveCustomColors', request);

		dispatch({
			payload: colorsSettings,
			type: EVENTS.SAVE_FULFILLED
		});
	} catch (e) {
		dispatch({
			payload: key,
			type: EVENTS.SAVE_REJECTED
		});
	}
};

/**
 * Удаляет настройки
 * @param {string} payload - ключ настроек
 * @returns {ThunkAction}
 */
const removeCustomChartColorsSettings = (payload: string) => async (dispatch: Dispatch) => {
	dispatch({
		payload,
		type: EVENTS.REMOVE_PENDING
	});

	try {
		const request = {
			...getParams(),
			key: payload
		};

		await window.jsApi.restCallModule('dashboardSettings', 'deleteCustomColors', request);

		dispatch({
			payload,
			type: EVENTS.REMOVE_FULFILLED
		});
	} catch (e) {
		dispatch({
			payload,
			type: EVENTS.REMOVE_REJECTED
		});
	}
};

/**
 * Устанавливает список настроек
 * @param {Array<CustomChartColorsSettingsData>} array - список настроек
 * @returns {ThunkAction}
 */
const setCustomChartsColorsSettings = (array: Array<CustomChartColorsSettingsData>): ThunkAction => (dispatch: Dispatch) => {
	const map = {};

	array.filter(Boolean).forEach(settings => {
		map[settings.key] = settings;
	});

	dispatch({
		payload: map,
		type: EVENTS.SET
	});
};

export {
	removeCustomChartColorsSettings,
	saveCustomChartColorsSettings,
	setCustomChartsColorsSettings
};
