// @flow
import type {Node} from 'react';
import {PLACEMENTS} from './constants';

type Placement = $Keys<typeof PLACEMENTS>;

export type Props = {
	children: Node,
	placement: Placement,
	renderContent?: () => Node,
	text: string
}
