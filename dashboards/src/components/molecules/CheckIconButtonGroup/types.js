// @flow
import type {IconName} from 'components/atoms/Icon/types';
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Option = {
	active?: boolean,
	name: IconName,
	title: string,
	value: string
};

export type Props = {
	className: string,
	disabled: boolean,
	name: string,
	onChange: OnChangeInputEvent => void,
	options: Array<Option>,
	value: InputValue
};
