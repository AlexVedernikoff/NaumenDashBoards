// @flow
import type {ComputedAttr} from 'store/widgets/data/types';
import {CONTROL_TYPES} from './constants';

export type ControlType = $Keys<typeof CONTROL_TYPES>;

export type Control = {
	name: string,
	type: ControlType,
	value: null
};

export type Props = {
	onClose: () => any,
	onRemove?: (attribute: ComputedAttr) => void,
	onSubmit: (attribute: ComputedAttr) => void,
	value: ComputedAttr | null
};

export type State = {
	controls: Array<Control>,
	info: string,
	showFormulaError: boolean,
	showLegacyFormatInfo: boolean,
	showRemoveInfo: boolean,
	templates: Array<Control>,
	title: string
};
