// @flow
import type {DivRef} from 'components/types';

export type Props = {
	children: Node,
	className: string,
	forwardedRef?: DivRef,
	hideContextMenu: () => void,
	x: number,
	y: number,
};
