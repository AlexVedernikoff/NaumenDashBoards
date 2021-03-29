// @flow
import type {ComponentProps as IconButtonProps} from 'components/atoms/IconButton/types';
import type {InputRef, OnChangeEvent} from 'components/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import type {Props as ValueProps} from './components/Value/types';

export type Option = Object;

export type Value = any;

export type SelectEvent = {
	name: string,
	value: Value;
};

export type MenuProps = {
	className: string,
	isSearching: boolean,
	loading: boolean,
	onSelect: Option => void,
	options: Array<Option>
};

export type Components = {
	Caret: React$ComponentType<IconButtonProps>,
	IndicatorsContainer: React$ComponentType<ContainerProps>,
	MenuContainer: React$ComponentType<ContainerProps>,
	Message: React$ComponentType<ContainerProps>,
	Value: React$ComponentType<ValueProps>,
	ValueContainer: React$ComponentType<ContainerProps>
};

export type Props = {
	className: string,
	components?: $Shape<Components>,
	disabled: boolean,
	editable: boolean,
	fetchOptions?: () => any,
	forwardedLabelInputRef?: InputRef,
	getOptionLabel: (option: Option) => string,
	getOptions: (options: Array<Option>) => Array<Option>,
	getOptionValue: (option: Option) => any,
	isSearching: boolean,
	loading: boolean,
	loadingMessage: string,
	multiple: boolean,
	name: string,
	noOptionsMessage: string,
	notFoundMessage: string,
	onChangeLabel?: OnChangeEvent<string> => void,
	onSelect?: SelectEvent => void,
	options: Array<Option>,
	placeholder: string,
	value: Value
};

export type State = {
	foundOptions: Array<Option>,
	searchValue: string,
	showMenu: boolean
};
