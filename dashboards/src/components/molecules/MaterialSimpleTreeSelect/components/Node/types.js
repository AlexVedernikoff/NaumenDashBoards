// @flow
import type {Node} from 'react';

type Value = Object;

export type Props = {
	children: Node,
	getValueLabel: Value => string,
	onClick: Value => void,
	root: boolean,
	selected: boolean,
	value: Object
};
