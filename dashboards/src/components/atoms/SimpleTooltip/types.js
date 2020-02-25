// @flow
import type {Node} from 'react';
import {PLACEMENTS} from './constants';

export type Props = {
	children: Node,
	className: string,
	placement: $Keys<typeof PLACEMENTS>,
	text: string | Node
};
