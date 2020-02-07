// @flow
import type {Node} from 'react';

export type Item = {
	key: string,
	text: string
};

export type Props = {
	children: Node,
	list: Array<Item>,
	onClick: (key: string) => any
};
