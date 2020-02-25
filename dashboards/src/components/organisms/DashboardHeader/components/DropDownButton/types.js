// @flow
import type {Node} from 'react';

export type MenuItem = {
	label: string,
	value: string
};

export type Props = {
	children: Node,
	menu: Array<MenuItem>,
	onSelect: (value: string) => Promise<void> | void,
	tip: string
};

export type State = {
	showMenu: boolean
};
