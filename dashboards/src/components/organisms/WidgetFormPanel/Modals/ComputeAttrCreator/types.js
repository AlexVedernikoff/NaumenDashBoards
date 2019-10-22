// @flow
import type {OptionType} from 'react-select/src/types';
import type {Props as ContainerProps} from 'containers/WidgetFormPanel/types';

export type Control = {
	name: string,
	next: string | null,
	prev: string | null,
	type: ?string,
	value: null,
}

export type Props = {
	onClose: () => any
} & ContainerProps;

export type State = {
	constants: Array<OptionType>,
	controls: {
		[string]: Control
	},
	first: string,
	last: string,
	sources: Array<OptionType>,
}

export type ComputedAttr = {
	code: string,
	computeData: any,
	stringForCompute: string,
	title: string
};
