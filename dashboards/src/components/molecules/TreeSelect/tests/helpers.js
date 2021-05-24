import {DEFAULT_COMPONENTS} from 'src/components/molecules/TreeSelect/constants';
import {getOptionLabel, getOptionValue} from 'src/components/molecules/TreeSelect/helpers';

/**
 * Возвращает пропсы компонента
 * @param mixin - примесь пропсов компонента
 */
const getProps = mixin => ({
	className: '',
	components: DEFAULT_COMPONENTS,
	getOptionLabel,
	getOptionValue,
	isDisabled: () => false,
	loading: false,
	multiple: false,
	name: 'name',
	placeholder: 'Выберите значение',
	removable: false,
	showMore: false,
	value: null,
	values: [],
	...mixin
});

export {
	getProps
};
