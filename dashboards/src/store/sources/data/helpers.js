// @flow
import type {
	DataSourcesState,
	RawDataSource,
	ReceiveDataSources
} from './types';

const createDataSource = (source: RawDataSource) => ({
	title: source.title,
	value: source.classFqn,
	key: source.classFqn,
	isLeaf: source.children && source.children.length === 0
});

const setChildrenDataSources = (map: any, classFqn: string, children: Array<RawDataSource>) => {
	map[classFqn].children = children.map(source => source.classFqn);

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
		map[source.classFqn] = {...createDataSource(source), root: true};
		map[source.classFqn].children = [];
		setChildrenDataSources(map, source.classFqn, source.children);
	});

	return {
		...state,
		loading: false,
		map: {...map}
	};
};
