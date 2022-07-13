// @flow
import type {Ref} from 'components/types';

export type Props = {
	children: React$Node,
	elementRef: Ref<any>,
	isModal: boolean,
	minOffset: number,
	onClickOutside: () => void
};

export type State = {
	childPosition?: {
		left: number,
		top: number
	}
};
