// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {OptionType} from 'react-select/src/types';

export type Props = {
	name: string,
	onChange: (name: string, option: OptionType) => void,
	options: Attribute[],
	placeholder: string,
	value: Attribute | null
};
