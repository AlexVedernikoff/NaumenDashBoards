import {getProps as getTreeProps} from 'src/components/molecules/TreeSelect/components/Tree/tests/helpers';

/**
 * Возвращает пропсы компонента
 * @param mixin - примесь пропсов компонента
 */
const getProps = mixin => ({
	...getTreeProps(),
	onAddConstant: jest.fn(),
	originalOptions: {},
	...mixin
});

export {
	getProps
};
