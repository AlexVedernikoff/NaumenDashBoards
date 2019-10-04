// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Node} from 'react';
import type {OptionType} from 'react-select/src/types';

export type Props = {
	getOptionLabel?: (o: OptionType) => string,
	getOptionValue?: (o: OptionType) => string,
	onSelect: (name: string, value: OptionType) => any,
	isLoading?: boolean,
	name: string,
	noOptionsMessage?: () => string | Node,
	options: OptionType[] | Attribute[],
	placeholder: string,
	value: Attribute | OptionType | null
};
