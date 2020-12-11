// @flow
import type {ComponentProps as CaretComponentProps} from './components/Caret/types';
import type {ComponentProps as IndicatorsContainerComponentProps} from './components/IndicatorsContainer/types';
import type {OnChangeInputEvent} from 'components/types';
import type {Props as ValueContainerProps} from './components/ValueContainer/types';
import type {Props as ValueLabelProps} from './components/ValueLabel/types';

export type Option = Object;

export type Value = Option | string | number | null;

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
	Caret: React$ComponentType<CaretComponentProps>,
	IndicatorsContainer: React$ComponentType<IndicatorsContainerComponentProps>,
	Menu: React$ComponentType<MenuProps>,
	ValueContainer: React$ComponentType<ValueContainerProps>,
	ValueLabel: React$ComponentType<ValueLabelProps>
};

export type Props = {
	async: boolean,
	className: string,
	components: $Shape<Components>,
	disabled: boolean,
	editable: boolean,
	error: boolean,
	fetchOptions?: () => any,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	isSearching: boolean,
	loading: boolean,
	name: string,
	onChangeLabel?: OnChangeInputEvent => void,
	onClickCreationButton?: () => void,
	onSelect: SelectEvent => void,
	options: Array<Option>,
	placeholder: string,
	showCreationButton: boolean,
	textCreationButton: string,
	uploaded: boolean,
	value: Value
};

export type State = {
	components: Components,
	showMenu: boolean
};
