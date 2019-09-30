// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {OptionType} from 'react-select/src/types';

export type Props = {
	isLoading: boolean,
	label: string,
	name: string,
	onChange: (option: OptionType) => void,
	options: Attribute[],
	placeholder: string,
	value: Attribute,
};
