// @flow
import type {Props as ContainerProps} from 'src/components/atoms/Container/types';

type Option = Object;

export type ValueContainerProps = ContainerProps & {option: Option};

export type Components = {|
	SelectedIcon: React$ComponentType<ContainerProps>,
	Value: React$ComponentType<ContainerProps>,
	ValueContainer: React$ComponentType<ValueContainerProps>,
|};

export type DefaultProps = {|
	className: string,
	components: $Shape<Components>,
|};

export type Props = {
	...DefaultProps,
	found: boolean,
	getOptionLabel?: Option => string,
	onClick: (Option) => void,
	option: Option,
	selected: boolean,
	style: CSSStyleDeclaration
};

export type ComponentProps = React$Config<Props, DefaultProps>;
