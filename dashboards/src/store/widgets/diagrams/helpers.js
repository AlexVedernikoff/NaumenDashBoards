// @flow
import type {
	DiagramsState,
	ReceiveDiagramPayload
} from './types';
import type {SetCreatedWidget, UpdateWidget, Widget} from 'store/widgets/data/types';

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {DiagramsState} state - хранилище данных графиков
 * @param {Widget} payload - данные виджета
 * @returns {void}
 */
export const resetData = (state: DiagramsState, {payload}: SetCreatedWidget | UpdateWidget) => {
	state[payload.id] = {
		...state[payload.id],
		data: null
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {DiagramsState} state - хранилище данных графиков
 * @param {string} payload - id виджета
 * @returns {void}
 */
export const setRequestDiagram = (state: DiagramsState, payload: string) => {
	state[payload] = {
		error: false,
		loading: true
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {DiagramsState} state - хранилище данных графиков
 * @param {ReceiveDiagramPayload} payload - данные графика и id виджета
 * @returns {void}
 */
export const setDiagram = (state: DiagramsState, payload: ReceiveDiagramPayload) => {
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

	state[payload.id] = {
		data: payload.data,
		error: false,
		loading: false
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {DiagramsState} state - хранилище данных графиков
 * @param {string} payload - id виджета
 * @returns {void}
 */
export const setDiagramError = (state: DiagramsState, payload: string) => {
	state[payload] = {
		error: true,
		loading: false
	};
};
