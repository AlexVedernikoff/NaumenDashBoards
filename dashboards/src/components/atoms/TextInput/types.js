// @flow
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Props = {
	name: string,
	onChange: OnChangeInputEvent => void,
	onlyNumber: boolean,
	placeholder: string,
	value: InputValue
};
