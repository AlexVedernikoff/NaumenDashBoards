// @flow
import type {
	BuildDataState,
	ReceiveBuildDataPayload
} from './types';

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {BuildDataState} state - хранилище данных графиков
 * @param {string} payload - id виджета
 * @returns {void}
 */
export const setRequestBuildData = (state: BuildDataState, payload: string) => {
	state[payload] = {
		...state[payload],
		data: {},
		error: false,
		loading: true
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {BuildDataState} state - хранилище данных графиков
 * @param {ReceiveBuildDataPayload} payload - данные графика и id виджета
 * @returns {void}
 */
export const setBuildData = (state: BuildDataState, payload: ReceiveBuildDataPayload) => {
	const {data, id} = payload;

	state[id] = {
		...state[id],
		data,
		error: !data,
		loading: false,
		updateDate: new Date()
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {BuildDataState} state - хранилище данных графиков
 * @param {string} payload - id виджета
 * @returns {void}
 */
export const setBuildDataError = (state: BuildDataState, payload: string) => {
	state[payload] = {
		...state[payload],
		error: true,
		loading: false
	};
};
