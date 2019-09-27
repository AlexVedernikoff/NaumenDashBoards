// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {OnChangeSelect} from 'components/organisms/WidgetFormPanel/types';

export type Props = {
	isLoading: boolean,
	label: string,
	name: string,
	onChange: OnChangeSelect,
	options: Attribute[],
	placeholder: string,
	value: Attribute
};
