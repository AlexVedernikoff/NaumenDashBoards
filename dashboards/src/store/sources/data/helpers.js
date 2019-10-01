// @flow
import type {
	DataSourcesState,
	RawDataSource,
	ReceiveDataSources
} from './types';

const createDataSource = (source: RawDataSource) => ({
	title: source.title,
	value: source.fqnCode,
	key: source.fqnCode,
	isLeaf: source.children && source.children.length === 0
});

const setChildrenDataSources = (map: any, fqn: string, children: Array<RawDataSource>) => {
	map[fqn].children = children.map(s => s.fqnCode);

	children.forEach(s => {
		map[s.fqnCode] = createDataSource(s);
		setChildrenDataSources(map, s.fqnCode, s.children);
	});
};

/**
 * Нормализуем данные классов для удобной работы с деревом
 * @param {DataSourcesState} state - хранилище состояния источников данных
 * @param {string} payload - fqn класса
 * @returns {DataSourcesState}
 */
export const setDataSources = (state: DataSourcesState, {payload}: ReceiveDataSources) => {
	let map = {};

	payload.forEach(s => {
		map[s.fqnCode] = {...createDataSource(s), root: true};
		map[s.fqnCode].children = [];
		setChildrenDataSources(map, s.fqnCode, s.children);
	});

	return {
		...state,
		loading: false,
		map: {...map}
	};
};
