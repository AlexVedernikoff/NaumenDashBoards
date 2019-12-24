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
	if (payload.data && typeof payload.data === 'object') {
		let {columns} = payload.data;
		/*
			На стороне бэка происходит принудительнае изменение ключей в строчный вариант.
			Библиотека react-table же ожидает ключи Header и Footer. По этой причине преобразуем
			массив в нужный вид.
		 */
		if (Array.isArray(columns)) {
			columns.forEach(c => {
				c.Header = c.header;
				c.Footer = c.footer;

				delete c.header;
				delete c.footer;
			});
		}
	}

	state[payload.id] = {
		...state[payload.id],
		data: payload.data,
		error: false,
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
