// @flow
import type {ComputedAttr} from 'store/widgets/data/types';

export type Props = {
	onRemove: (value: ComputedAttr) => void,
	onSubmit: (value: ComputedAttr) => void,
	value: ComputedAttr
};

export type State = {
	showModal: boolean
};
