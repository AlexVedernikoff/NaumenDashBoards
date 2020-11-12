// @flow
import type {IconName} from 'components/atoms/Icon/types';
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Icon = {
	active?: boolean,
	name: IconName,
	title: string,
	value: string
};

export type Props = {
	className: string,
	disabled: boolean,
	icons: Array<Icon>,
	name: string,
	onChange: OnChangeInputEvent => void,
	value: InputValue
};
