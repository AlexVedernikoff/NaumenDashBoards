// @flow
import type {ComponentProps as ListOptionProps} from 'components/molecules/Select/components/ListOption/types';

type Option = {label?: string, value?: string};

export type Components = {
	ListOption: React$ComponentType<ListOptionProps>,
};

export type DefaultProps = {|
	components: $Shape<Components>,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => any,
	itemSize: number,
	maxHeight: number,
	multiple: boolean,
	searchValue: string,
	showMore: boolean,
	value: Option | null,
	values: Array<Option>
|};

export type Props = {
	...DefaultProps,
	onClickShowMore?: () => void,
	onSelect: (option: Option) => void,
	options: Array<Option>,
};

export type ComponentProps = React$Config<Props, DefaultProps>;
