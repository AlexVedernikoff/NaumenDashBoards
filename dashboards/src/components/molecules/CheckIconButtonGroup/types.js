// @flow
import type {IconName} from 'components/atoms/Icon/types';
import type {InputValue, OnChangeInputEvent} from 'components/types';

export type Icon = {
	name: IconName,
	value: string
};

export type Props = {
	className: string,
	icons: Array<Icon>,
	name: string,
	onChange: OnChangeInputEvent => void,
	value: InputValue
};
