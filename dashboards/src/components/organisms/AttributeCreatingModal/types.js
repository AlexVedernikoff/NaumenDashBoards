// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ComputedAttr, Source} from 'store/widgets/data/types';
import {CONTROL_TYPES} from './constants';

export type ControlType = $Keys<typeof CONTROL_TYPES>;

export type SourceOption = {
	attributes: Array<Attribute>,
	dataKey: string,
	source: Source
};

export type Control = {
	name: string,
	type: ControlType,
	value: null
};

export type Props = {
	onClose: () => any,
	onRemove?: (code: string) => void,
	onSubmit: (attribute: ComputedAttr) => void,
	sources: Array<SourceOption>,
	value: ComputedAttr | null
};

export type State = {
	controls: Array<Control>,
	info: string,
	showLegacyFormatInfo: boolean,
	showRemoveInfo: boolean,
	templates: Array<Control>,
	title: string
};
