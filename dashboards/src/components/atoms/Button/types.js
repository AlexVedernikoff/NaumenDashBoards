// @flow
import type {Node} from 'react';

export type Props = {
	block: boolean,
	children: Node,
	className: string,
	disabled: boolean,
	onClick?: () => any,
	type: string,
	variant: string
};
