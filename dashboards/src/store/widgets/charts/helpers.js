// @flow
import type {
	ChartsState,
	ReceiveChart,
	ReceiveChartPayload,
	RecordErrorChart,
	RequestChart
} from './types';

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {ChartsState} state - хранилище данных графиков
 * @param {string} payload - id виджета
 * @returns {ChartsState}
 */
export const setRequestChart = (state: ChartsState, {payload}: RequestChart): ChartsState => {
	const newState = {error: false, loading: true};
	state.map[payload] = payload in state.map ? {...state.map[payload], ...newState} : newState;

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {ChartsState} state - хранилище данных графиков
 * @param {ReceiveChartPayload} payload - данные графика и id виджета
 * @returns {ChartsState}
 */
export const setChart = (state: ChartsState, {payload}: ReceiveChart): ChartsState => {
	state.map[payload.id] = {
		data: payload.data,
		error: false,
		loading: false
	};

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {ChartsState} state - хранилище данных графиков
 * @param {string} payload - id виджета
 * @returns {ChartsState}
 */
export const setChartError = (state: ChartsState, {payload}: RecordErrorChart): ChartsState => {
	const newState = {error: true, loading: false};
	state.map[payload] = payload in state.map ? {...state.map[payload], ...newState} : newState;

	return {
		...state,
		map: {...state.map}
	};
};
