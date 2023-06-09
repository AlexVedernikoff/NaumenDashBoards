// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	debounceRate: number,
	forwardedRefKey: string,
	onResize?: (width: number, height: number) => void,
	skipOnMount: boolean
};

export type State = {
	mounted: boolean
};
