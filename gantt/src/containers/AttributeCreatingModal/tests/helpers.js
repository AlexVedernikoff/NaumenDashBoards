import {getSource} from 'components/organisms/AttributeCreatingModal/components/SourceControl/tests/helpers';

/**
 * Возвращает пропсы компонента
 * @param mixin - примесь пропсов компонента
 */
const getProps = mixin => ({
	attributes: {},
	fetchAttribute: () => undefined,
	values: {
		data: [{
			dataKey: 'dataKey',
			source: {
				value: getSource()
			}
		}]
	},
	...mixin
});

export {
	getProps
};
