// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	debounceRate: number,
	onResize?: (width: number, height: number) => void,
	skipOnMount: boolean
};

export type State = {
	mounted: boolean
};
