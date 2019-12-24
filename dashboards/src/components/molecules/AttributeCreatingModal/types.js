// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {OptionType} from 'react-select/src/types';
import type {SourceValue} from 'components/molecules/Source/types';

export type ComputedAttr = {
	code: string,
	computeData: any,
	stringForCompute: string,
	title: string
};

export type Control = {
	name: string,
	next: string | null,
	prev: string | null,
	type: ?string,
	value: null,
}

export type Props = {
	getAttributeOptions: (source: any) => Array<Attribute>,
	onClose: () => any,
	onSubmit: (attribute: ComputedAttr) => void,
	sources: Array<SourceValue>,
};

export type State = {
	constants: Array<OptionType>,
	controls: {
		[string]: Control
	},
	first: string,
	focus: boolean,
	last: string
}
