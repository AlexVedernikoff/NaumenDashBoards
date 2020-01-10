// @flow
import type {
	DataSourceMap,
	DataSourcesState,
	RawDataSource,
	ReceiveDataSources
} from './types';

const createDataSource = (source: RawDataSource, parent: string | null = null) => ({
	children: [],
	parent,
	title: source.title,
	value: source.classFqn
});

const setChildrenDataSources = (map: DataSourceMap, classFqn: string, children: Array<RawDataSource>) => {
	map[classFqn].children = children.map(source => source.classFqn);

	children.forEach(source => {
		map[source.classFqn] = createDataSource(source, classFqn);
		setChildrenDataSources(map, source.classFqn, source.children);
	});
};

/**
 * Нормализуем данные классов для удобной работы с деревом
 * @param {DataSourcesState} state - хранилище состояния источников данных
 * @param {string} payload - массив классов с детьми
 * @returns {DataSourcesState}
 */
export const setDataSources = (state: DataSourcesState, {payload}: ReceiveDataSources) => {
	let map = {};

	payload.forEach(source => {
		const {children, classFqn} = source;
		map[classFqn] = createDataSource(source, null);

		setChildrenDataSources(map, classFqn, children);
	});

	return {
		...state,
		loading: false,
		map
	};
};
