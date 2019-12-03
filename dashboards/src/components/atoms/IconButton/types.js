// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	onClick?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
	tip: string | Node
}
