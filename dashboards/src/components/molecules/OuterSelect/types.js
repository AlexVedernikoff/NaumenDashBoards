// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Value = string;

export type Option = {
	icon: IconName,
	tip: string,
	value: Value
};

export type Props = {
	name: string,
	onSelect: (name: string, value: Value) => void,
	options: Array<Option>,
	value: Value
};
