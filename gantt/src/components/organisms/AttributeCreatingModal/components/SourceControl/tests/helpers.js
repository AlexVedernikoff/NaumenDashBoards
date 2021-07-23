import {DEFAULT_AGGREGATION} from 'store/widgets/constants';

/**
 * Возвращает данные атрибута
 * @param mixin - примесь данных атрибута
 */
const getAttribute = mixin => ({
	code: 'code',
	title: 'attribute',
	...mixin
});

/**
 * Возвращает данные источника
 * @param mixin - примесь данных источника
 */
const getSource = mixin => ({
	label: 'source',
	value: 'classFqn',
	...mixin
});

/**
 * Возвращает пропсы компонента
 * @param mixin - примесь пропсов компонента
 */
const getProps = () => ({
	index: 0,
	name: 'name',
	onClick: () => undefined,
	onFetch: () => undefined,
	onSelect: () => undefined,
	options: {},
	value: {
		aggregation: DEFAULT_AGGREGATION.COUNT,
		attribute: getAttribute(),
		dataKey: 'dataKey',
		source: getSource()
	}
});

export {
	getAttribute,
	getSource,
	getProps
};
