// @flow
import type {InputRef} from 'components/types';
import type {Option, Value} from 'components/molecules/Select/types';

export type Props = {
	editableLabel: boolean,
	forwardedInputRef?: InputRef,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	maxLabelLength: number | null,
	onChangeLabel?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
	onClick: () => void,
	placeholder: string,
	value: Value | null
};
