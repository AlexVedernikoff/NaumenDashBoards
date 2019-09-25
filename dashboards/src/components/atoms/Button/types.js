// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	onClick?: () => any,
	outline?: boolean,
	type?: string,
	variant: string
};
