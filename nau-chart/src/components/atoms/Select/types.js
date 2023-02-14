// @flow
import type {ComponentProps as IconButtonProps} from 'components/atoms/IconButton/types';
import type {ComponentProps as ListProps} from './components/List/types';
import type {OnChangeEvent, Ref} from 'components/atoms/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import type {Props as SearchInputProps} from 'components/atoms/SearchInput/types';

export type Option = Object;

type Value = string | boolean;

export type SelectEvent = {
	name: string,
	value: Value;
};

type Components = {
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
	icon?: string,
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
