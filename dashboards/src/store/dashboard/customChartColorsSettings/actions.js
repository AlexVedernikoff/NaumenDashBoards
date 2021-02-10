// @flow
import type {CustomChartColorsSettingsData} from 'src/store/widgets/data/types';
import type {Dispatch, ThunkAction} from 'store/types';
import {EVENTS} from './constants';

/**
 * Сохраняет настройки
 * @param {CustomChartColorsSettingsData} settings - настройки
 * @return {ThunkAction}
 */
const saveCustomChartColorsSettings = (settings: CustomChartColorsSettingsData): ThunkAction => (dispatch: Dispatch) => {
	const {key} = settings;

	dispatch({
		payload: key,
		type: EVENTS.SAVE_PENDING
	});

	try {
		// TODO: дождаться реализации бэка
		dispatch({
			payload: settings,
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
 * @return {ThunkAction}
 */
const removeCustomChartColorsSettings = (payload: string) => (dispatch: Dispatch) => {
	dispatch({
		payload,
		type: EVENTS.REMOVE_PENDING
	});

	try {
		// TODO: дождаться реализации бэка
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

export {
	removeCustomChartColorsSettings,
	saveCustomChartColorsSettings
};
