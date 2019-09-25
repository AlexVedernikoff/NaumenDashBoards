// @flow
import type {
	DataSourcesState,
	RawDataSource,
	ReceiveDataSources,
	ReceiveDataSourcesPayload,
	RecordDataSourcesError,
	SetDataSources
} from './types';

/**
 * Устанавливаем значение ошибки получения дочерних типов в объект нужного класса\типа
 * @param {DataSourcesState} state - хранилище состояния источников данных
 * @param {string} payload - fqn класса
 * @returns {DataSourcesState}
 */
export const setDataSourceError = (state: DataSourcesState, {payload}: RecordDataSourcesError): DataSourcesState => {
	state.map[payload].errorLoadingChildren = true;

	return {
		...state,
		map: {...state.map}
	};
};

const createDataSource = (source: RawDataSource) => ({
	title: source.title,
	value: source.fqnCode,
	key: source.fqnCode,
	isLeaf: source.countChildren === 0
});

/**
 * Нормализуем данные классов для удобной работы с деревом
 * @param {DataSourcesState} state - хранилище состояния источников данных
 * @param {string} payload - fqn класса
 * @returns {DataSourcesState}
 */
export const setRootDataSources = (state: DataSourcesState, {payload}: SetDataSources) => {
	let map = {};

	payload.forEach(s => {
		map[s.fqnCode] = {...createDataSource(s), root: true};
	});

	return {
		...state,
		map: {...map}
	};
};

/**
 * Нормализуем данные типов для удобной работы с деревом
 * @param {DataSourcesState} state - хранилище состояния источников данных
 * @param {ReceiveDataSourcesPayload} payload - источники данных и fqn родительского класса
 * @returns {DataSourcesState}
 */
export const setChildrenDataSources = (state: DataSourcesState, {payload}: ReceiveDataSources) => {
	state.map[payload.fqn].children = payload.dataSources.map(s => s.fqnCode);
	payload.dataSources.forEach(s => {
		state.map[s.fqnCode] = createDataSource(s);
	});

	return {
		...state,
		map: {...state.map}
	};
};
