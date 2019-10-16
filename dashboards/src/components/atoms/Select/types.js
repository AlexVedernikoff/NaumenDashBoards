// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Node} from 'react';
import type {OptionType} from 'react-select/src/types';

export type Props = {
	components?: {[string]: any},
	getOptionLabel?: (o: OptionType) => string,
	getOptionValue?: (o: OptionType) => string,
	onSelect: (name: string, value: OptionType) => any,
	isLoading?: boolean,
	name: string,
	noOptionsMessage?: () => string | Node,
	options: OptionType[],
	placeholder: string,
	value: Attribute | OptionType | null,
	small: boolean
};
