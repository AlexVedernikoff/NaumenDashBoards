// @flow
import type {Node as ReactNode} from 'react';
import type {Node} from 'components/molecules/MaterialTreeSelect/components/Tree/types';

type Option = Object;

export type Props = {
	data: Node,
	enabled: boolean,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	onClick: Node => void,
	onLoadChildren: Node => void,
	renderChildren: (Array<string>) => Array<ReactNode>,
	searchValue: string,
	selected: boolean
};

export type State = {
	expanded: boolean
};
