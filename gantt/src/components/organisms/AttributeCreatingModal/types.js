// @flow
import type {ComputedAttr} from 'store/widgets/data/types';
import {CONTROL_TYPES} from './constants';
import type {Node, Tree} from 'components/molecules/TreeSelect/types';

export type ControlType = $Keys<typeof CONTROL_TYPES>;

export type Control = {
	name: string,
	type: ControlType,
	value: null
};

export type Props = {
	onClose: () => any,
	onFetch: (node: Node) => void,
	onRemove?: (attribute: ComputedAttr) => void,
	onSubmit: (attribute: ComputedAttr) => void,
	options: Tree,
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
