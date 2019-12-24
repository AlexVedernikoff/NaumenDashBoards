// @flow
import type {OptionType, OptionsType} from 'react-select/src/types';

export type Form = {
	onSubmit: (name: string, value: string) => any,
	rule?: any,
	value: string | number
};

export type Props = {
	attr: boolean,
	components?: {[string]: any},
	createButtonText: string,
	defaultValue: OptionsType,
	form?: Form,
	getOptionLabel?: (o: OptionType) => string,
	getOptionValue?: (o: OptionType) => string,
	isDisabled: boolean,
	isEditableLabel: boolean,
	isLoading: boolean,
	isRemovable: boolean,
	isSearchable: boolean,
	menuIsOpen?: boolean,
	name: string,
	onClickCreateButton?: () => void,
	onRemove?: (name: string) => void,
	onSelect: (name: string, value: OptionType) => void | Promise<void>,
	options: OptionType[],
	placeholder: string,
	showBorder: boolean,
	value: OptionType | null,
	withCreate: boolean
};

export type State = {
	showForm: boolean
};
