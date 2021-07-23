// @flow
import type {Ref} from 'components/types';

export type Props = {
	children: React$Node,
	elementRef: Ref<any>,
	minOffset: number,
	onClickOutside: () => void
};

export type State = {
	childPosition?: {
		left: number,
		top: number
	}
};
