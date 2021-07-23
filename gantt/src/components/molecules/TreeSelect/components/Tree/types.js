// @flow
import type {Components, Node, Option, Tree} from 'components/molecules/TreeSelect/types';

export type State = {
	foundIds: Array<string>,
	selectedIds: Array<string>
};

export type DefaultProps = {|
	isDisabled: (node: Node) => boolean,
	loading: boolean,
	multiple: boolean,
	showMore: boolean,
	value: Option | null,
	values: Array<Option>
|};

export type Props = {
	...DefaultProps,
	components: Components,
	getNodeLabel: (node: Node) => string,
	getNodeValue: (node: Node) => ?string,
	getOptionLabel: (option: Option | null) => string,
	getOptionValue: (option: Option | null) => ?string,
	onFetch?: (value: Node | null, offset?: number) => void,
	onSelect: Node => void,
	options: Tree,
	searchValue: string,
};

export type ComponentProps = React$Config<Props, DefaultProps>;
