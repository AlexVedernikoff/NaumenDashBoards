// @flow
import type {Node} from 'react';
import {VARIANTS} from './constants';

export type Props = {
	block: boolean,
	children: Node,
	className: string,
	disabled: boolean,
	onClick?: (e: Event) => any,
	outline: boolean,
	type: string,
	variant: $Keys<typeof VARIANTS>
};
