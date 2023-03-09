// @flow
import type {Props as RadioButtonProps} from 'components/atoms/RadioButton/types';

export type Props = {
	...RadioButtonProps,
	className: string,
	disabled: boolean,
	disabledMessage: string,
	label: string
};
