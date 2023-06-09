// @flow
import type {ComponentProps as IconButtonProps} from 'components/atoms/IconButton/types';
import type {ComponentProps as ListProps} from './components/List/types';
import type {ComponentProps as ListOptionProps} from './components/ListOption/types';
import type {InputRef, OnChangeEvent} from 'components/types';
import type {LangType} from 'localization/localize_types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import type {Props as SearchInputProps} from 'components/atoms/SearchInput/types';
import type {Props as ValueProps} from './components/Value/types';

export type Option = Object;

export type Value = any;

export type SelectEvent = {
	name: string,
	value: Value;
};

export type Components = {
	Caret: React$ComponentType<IconButtonProps>,
	IndicatorsContainer: React$ComponentType<ContainerProps>,
	List: React$ComponentType<ListProps>,
	ListOption: React$ComponentType<ListOptionProps>,
	MenuContainer: React$ComponentType<ContainerProps>,
	MenuHeader: React$ComponentType<ContainerProps>,
	Message: React$ComponentType<ContainerProps>,
	SearchInput: React$ComponentType<SearchInputProps>,
	Value: React$ComponentType<ValueProps>,
	ValueContainer: React$ComponentType<ContainerProps>
};

export type DefaultProps = {|
	className: string,
	disabled: boolean,
	editable: boolean,
	getOptionLabel: (option: Option) => string,
	getOptions: (options: Array<Option>) => Array<Option>,
	getOptionValue: (option: Option) => any,
	isSearching: boolean,
	loading: boolean,
	loadingMessage: LangType,
	menuHeaderMessage: ?string,
	multiple: boolean,
	name: string,
	noOptionsMessage: LangType,
	notFoundMessage: LangType,
	options: Array<Option>,
	placeholder: string,
	value: Value,
	values: ?Value[]
|};

export type Props = {
	...DefaultProps,
	components: Components,
	fetchOptions?: () => any,
	forwardedLabelInputRef?: InputRef,
	onChangeLabel?: (event: OnChangeEvent<string>, callback?: Function) => void,
	onSelect: SelectEvent => void,
};

export type ComponentProps = React$Config<Props, DefaultProps>;

export type State = {
	foundOptions: Array<Option>,
	searchValue: string,
	showMenu: boolean
};
