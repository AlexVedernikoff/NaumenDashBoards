// @flow
import type {Node} from 'react';
import type {Ref} from 'components/types';

export type Props = {
	children: Node,
	className: string,
	debounceRate: number,
	forwardedRef?: Ref<'div'>,
	onResize?: (width: number, height: number) => void,
	skipOnMount: boolean
};

export type State = {
	mounted: boolean
};
