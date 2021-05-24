// @flow
import type {Node} from 'components/molecules/TreeSelect/types';

export type Props = {
	children: (Array<string>) => Array<React$Node>,
	data: Node,
	disabled: boolean,
	getNodeLabel: (option: Node) => string,
	onClick: Node => void,
	onLoadChildren: Node => void,
	searchValue: string,
	selected: boolean,
	showMore: boolean
};

export type State = {
	expanded: boolean
};
