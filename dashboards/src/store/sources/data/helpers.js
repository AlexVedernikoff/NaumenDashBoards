// @flow
import type {
	DataSourceMap,
	DataSourcesState,
	RawDataSource,
	ReceiveDataSources
} from './types';

const createDataSource = (source: RawDataSource, root: boolean = false) => ({
	children: null,
	root,
	label: source.title,
	value: source.classFqn,
	uploaded: true
});

const setChildrenDataSources = (map: DataSourceMap, classFqn: string, children: Array<RawDataSource>) => {
	if (children.length > 0) {
		map[classFqn].children = children.map(source => source.classFqn);
	}

	children.forEach(source => {
		map[source.classFqn] = createDataSource(source);
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
		map[classFqn] = createDataSource(source, true);

		setChildrenDataSources(map, classFqn, children);
	});

	return {
		...state,
		loading: false,
		map
	};
};
