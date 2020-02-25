// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	className: string,
	onClick?: () => void,
	tip: string
};
