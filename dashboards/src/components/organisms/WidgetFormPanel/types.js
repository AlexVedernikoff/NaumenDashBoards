// @flow
import type {Form} from 'components/molecules/Select/types';
import type {OptionType} from 'react-select/src/types';

export type State = {
	currentTab: string
}

export type TabParams = {
	key: string,
	title: string
}

export type CreateFormData = {
	name: string,
	type: OptionType,
	[string]: any
};

export type SaveFormData = {
	id: string
} & CreateFormData;

export type FormData = SaveFormData | CreateFormData;

export type SelectValue = {
	[string]: any
};

export type Select = {
	components?: {[string]: any},
	createButtonText?: string,
	form?: Form,
	onClickCreateButton?: () => void,
	onSelect?: (name: string, value: OptionType) => void | Promise<void>;
	isDisabled?: boolean,
	name: string,
	placeholder?: string,
	withCreateButton?: boolean,
	withEditIcon?: boolean,
};

export type WrappedProps = {
	[string]: any
};
