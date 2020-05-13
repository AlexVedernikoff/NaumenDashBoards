// @flow
import type {Node as ReactNode} from 'react';
import type {Node} from 'components/molecules/MaterialTreeSelect/components/Tree/types';
import type {Value} from 'components/molecules/MaterialTreeSelect/types';

type Option = Object;

export type Props = {
	children: ReactNode,
	expanded: boolean,
	found: boolean,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	onClick: Value => void,
	onClickToggleIcon: (value: string) => void,
	onLoadMoreChildren?: (value: string, offset: number) => void,
	selected: boolean,
	showMoreChildren: boolean,
	value: Node
};
