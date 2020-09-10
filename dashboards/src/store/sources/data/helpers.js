// @flow
import type {DataSourceMap, RawDataSource} from './types';

const createDataSource = (source: RawDataSource, parent: string | null) => {
	const {classFqn: value, hasDynamic, title: label} = source;

	return {
		children: null,
		error: false,
		hasDynamic,
		id: value,
		loading: false,
		parent,
		uploaded: true,
		value: {
			label,
			value
		}
	};
};

const setChildrenDataSources = (map: DataSourceMap, classFqn: string, children: Array<RawDataSource>) => {
	if (children.length > 0) {
		map[classFqn].children = children.map(source => source.classFqn);
	}

	children.forEach(source => {
		map[source.classFqn] = createDataSource(source, classFqn);
		setChildrenDataSources(map, source.classFqn, source.children);
	});
};

/**
 * Нормализуем данные классов для удобной работы с деревом
 * @param {Array<RawDataSource>} sources - массив классов с типами и подтипами
 * @returns {DataSourceMap}
 */
export const getDataSourceMap = (sources: Array<RawDataSource>) => {
	let map = {};

	sources.forEach(source => {
		const {children, classFqn} = source;
		map[classFqn] = createDataSource(source, null);

		setChildrenDataSources(map, classFqn, children);
	});

	return map;
};
