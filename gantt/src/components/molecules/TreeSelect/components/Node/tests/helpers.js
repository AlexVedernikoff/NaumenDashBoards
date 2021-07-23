/**
 * Возвращает данные узла
 * @param mixin - примесь данных узла
 */
const getNode = mixin => ({
	children: null,
	id: 'value',
	loading: false,
	parent: null,
	uploaded: true,
	value: {
		label: 'label',
		value: 'value'
	},
	...mixin
});

/**
 * Возвращает пропсы компонента
 * @param mixin - примесь пропсов компонента
 */
const getProps = mixin => {
	const data = getNode();

	return {
		children: jest.fn().mockReturnValue(null),
		data,
		disabled: false,
		getNodeLabel: node => node.value.label,
		onClick: jest.fn(),
		onLoadChildren: jest.fn(),
		searchValue: '',
		selected: false,
		showMore: false,
		...mixin
	};
};

export {
	getProps,
	getNode
};
