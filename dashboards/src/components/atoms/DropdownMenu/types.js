// @flow
import {MENU_POSITION} from './constants';
import type {Node} from 'react';

export type Props = {
	children: Node,
	className: string,
	onSelect: () => void,
	onToggle: () => void,
	selectable: boolean,
};

export type State = {
	position: $Values<typeof MENU_POSITION>
};
