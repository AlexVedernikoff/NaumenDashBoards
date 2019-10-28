// @flow
import type {
	DiagramsState,
	ReceiveDiagram,
	ReceiveDiagramPayload,
	RecordErrorDiagram,
	RequestDiagram
} from './types';
import type {SetCreatedWidget, UpdateWidget, Widget} from 'store/widgets/data/types';

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {DiagramsState} state - хранилище данных графиков
 * @param {Widget} payload - данные виджета
 * @returns {DiagramsState}
 */
export const resetData = (state: DiagramsState, {payload}: SetCreatedWidget | UpdateWidget): DiagramsState => {
	state.map[payload.id] = {
		...state.map[payload.id],
		data: null
	};

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {DiagramsState} state - хранилище данных графиков
 * @param {string} payload - id виджета
 * @returns {DiagramsState}
 */
export const setRequestDiagram = (state: DiagramsState, {payload}: RequestDiagram): DiagramsState => {
	state.map[payload] = {
		error: false,
		loading: true
	};

	return {
		...state,
		map: {...state.map}
	};
};

/**
 * Устанавливаем данные графика конкретного виджета
 * @param {DiagramsState} state - хранилище данных графиков
 * @param {ReceiveDiagramPayload} payload - данные графика и id виджета
 * @returns {DiagramsState}
 */
export const setDiagram = (state: DiagramsState, {payload}: ReceiveDiagram): DiagramsState => {
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
 * @param {DiagramsState} state - хранилище данных графиков
 * @param {string} payload - id виджета
 * @returns {DiagramsState}
 */
export const setDiagramError = (state: DiagramsState, {payload}: RecordErrorDiagram): DiagramsState => {
	state.map[payload] = {
		error: true,
		loading: false
	};

	return {
		...state,
		map: {...state.map}
	};
};
