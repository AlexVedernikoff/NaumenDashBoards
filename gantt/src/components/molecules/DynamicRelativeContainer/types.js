// @flow
import type {Ref} from 'components/types';

export type AbsoluteElementProps = {
	className: string,
	ref: Ref<any>,
	top: number
};

export type Props = {
	children: React$Node,
	className: string,
	onMouseDown?: Function,
	renderAbsoluteElement: (props: AbsoluteElementProps) => React$Node
};

export type State = {
	top: number
};
