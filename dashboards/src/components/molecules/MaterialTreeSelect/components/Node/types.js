// @flow
import type {Node as ReactNode} from 'react';
import type {Node} from 'components/molecules/MaterialTreeSelect/components/Tree/types';

type Option = Object;

export type Props = {
	children: (Array<string>) => Array<ReactNode>,
	data: Node,
	enabled: boolean,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	onClick: Node => void,
	onLoadChildren: Node => void,
	searchValue: string,
	selected: boolean
};

export type State = {
	expanded: boolean
};
