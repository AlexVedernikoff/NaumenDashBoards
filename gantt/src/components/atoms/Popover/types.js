// @flow
import type {Node} from 'react';
import {PLACEMENTS} from './constants';

export type Props = {
	children: Node,
	placement: $Keys<typeof PLACEMENTS>,
	renderContent?: () => Node,
	text: string
};
