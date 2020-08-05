// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	className: string,
	onSelect: () => void,
	onToogle: () => void,
	selectable: boolean,
};
