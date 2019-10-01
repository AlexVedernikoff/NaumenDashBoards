// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Node} from 'react';
import type {OptionType} from 'react-select/src/types';

export type Props = {
	getOptionLabel?: (o: OptionType) => string,
	getOptionValue?: (o: OptionType) => string,
	isLoading: boolean,
	label: string,
	name: string,
	noOptionsMessage?: () => string | Node,
	onChange: (name: string, value: OptionType) => void,
	options: OptionType[] | Attribute[],
	placeholder: string,
	value: Attribute | OptionType | null
};
