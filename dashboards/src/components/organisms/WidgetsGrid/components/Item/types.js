// @flow
import type {Ref} from 'components/types';

type GridProps = {
	className?: string,
	onMouseDown?: Function,
	onMouseUp?: Function,
	onTouchEnd?: Function,
	onTouchStart?: Function,
	style?: Object
};

export type Props = GridProps & {
	children: React$Node,
	focused: boolean,
	forwardedRef: Ref<'div'>,
	onFocus: (element: HTMLDivElement) => void,
	selected: boolean
};
