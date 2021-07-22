// @flow
import type {ComponentProps as IconButtonProps} from 'src/components/IconButton/types';
import type {ComponentProps as ListProps} from './components/List/types';
import type {OnChangeEvent, Ref} from 'src/components/types';
import type {Props as ContainerProps} from 'src/components/Container/types';
import type {Props as SearchInputProps} from 'src/components/SearchInput/types';

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
	MenuContainer: React$ComponentType<ContainerProps>,
	MenuHeader: React$ComponentType<ContainerProps>,
	Message: React$ComponentType<ContainerProps>,
	SearchInput: React$ComponentType<SearchInputProps>,
	Value: React$ComponentType<ContainerProps>,
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
	loadingMessage: string,
	menuHeaderMessage: ?string,
	multiple: boolean,
	name: string,
	noOptionsMessage: string,
	notFoundMessage: string,
	options: Array<Option>,
	placeholder: string,
	value: Value,
	values: ?Value[]
|};

export type Props = {
	...DefaultProps,
	components: Components,
	fetchOptions?: () => any,
	forwardedLabelInputRef?: Ref<'input'>,
	onChangeLabel?: OnChangeEvent<string> => void,
	onSelect: SelectEvent => void,
};

export type State = {
	foundOptions: Array<Option>,
	searchValue: string,
	showMenu: boolean
};
