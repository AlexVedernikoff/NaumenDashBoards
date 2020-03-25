// @flow
import type {ComputedAttr} from 'store/widgets/data/types';
import {CONTROL_TYPES} from './constants';
import type {Option} from 'components/molecules/SourceControl/types';

export type ControlType = $Keys<typeof CONTROL_TYPES>;

export type Control = {
	name: string,
	next: string,
	prev: string,
	type: ControlType,
	value: null,
};

export type Props = {
	onClose: () => any,
	onRemove?: (code: string) => void,
	onSubmit: (attribute: ComputedAttr) => void,
	sources: Array<Option>,
	value: ComputedAttr | null
};

export type State = {
	controls: {
		[string]: Object
	},
	first: string,
	info: string,
	last: string,
	secondTemplateType: ControlType,
	showLegacyFormatInfo: boolean,
	showRemoveInfo: boolean,
	title: string
};
