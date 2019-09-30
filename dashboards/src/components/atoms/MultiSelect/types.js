// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {OptionsType} from 'react-select/src/types';

export type Props = {
	isLoading?: boolean,
	label: string,
	name: string,
	onChange: (option: OptionType) => void,
	options: OptionsType | Attribute[],
	placeholder: string,
	value: Attribute,
};
