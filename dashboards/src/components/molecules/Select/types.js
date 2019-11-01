// @flow
import type {OptionType, OptionsType} from 'react-select/src/types';

export type Form = {
	onSubmit: (name: string, value: string) => any,
	rule?: any,
	value: string | number
};

export type SelectSize =
	| 'small'
	| 'normal'
;

export type Props = {
	attr: boolean,
	border: boolean,
	color: string,
	components?: {[string]: any},
	createButtonText: string,
	defaultValue: OptionsType,
	form?: Form,
	getOptionLabel?: (o: OptionType) => string,
	getOptionValue?: (o: OptionType) => string,
	isDisabled: boolean,
	isLoading: boolean,
	isSearchable: boolean,
	menuIsOpen?: boolean,
	name: string,
	onClickCreateButton?: () => any,
	onSelect: (name: string, value: OptionType) => any,
	options: OptionType[],
	placeholder: string,
	size: SelectSize,
	value: OptionType | null,
	withCreateButton: boolean,
	withEditIcon: boolean
};

export type State = {
	showForm: boolean
};
