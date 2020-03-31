// @flow
import type {InputRef} from 'components/types';
type Option = Object;

type Value = {
	label: string,
	value: string
};

export type Props = {
	editableLabel: boolean,
	forwardedInputRef?: InputRef,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	onChangeLabel?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
	onClick: () => void,
	placeholder: string,
	value: Value | null
};
