// @flow
import type {Node as ReactNode} from 'react';
import type {Node, NodeValue} from 'components/molecules/MaterialTreeSelect/components/Tree/types';

type Option = Object;

export type Props = {
	children: ReactNode,
	data: Node,
	disabled: boolean,
	expanded: boolean,
	found: boolean,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	onClick: Node => void,
	onClickToggleIcon: (value: NodeValue) => void,
	onLoadMoreChildren?: (value: string, offset: number) => void,
	selected: boolean,
	showMoreChildren: boolean
};
