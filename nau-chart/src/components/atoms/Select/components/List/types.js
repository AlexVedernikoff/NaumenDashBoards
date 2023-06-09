// @flow
import type {ComponentProps as ListOptionProps} from 'components/atoms/Select/components/ListOption/types';

export type Option = {label?: string, value?: string};

export type Components = {
	ListOption: React$ComponentType<ListOptionProps>,
};

export type DefaultProps = {|
	components: $Shape<Components>,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
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
	onSelect: (option: Option | Option[]) => void,
	options: Array<Option>,
};

export type ComponentProps = React$Config<Props, DefaultProps>;
