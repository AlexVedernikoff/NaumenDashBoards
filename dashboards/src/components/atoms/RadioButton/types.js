// @flow
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Props = {
	checked: boolean,
	name: string,
	onChange: OnChangeInputEvent => void,
	value: InputValue
};
