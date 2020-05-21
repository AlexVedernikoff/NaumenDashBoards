// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Option = {
	icon: IconName,
	tip: string,
	value: string
};

export type Props = {
	name: string,
	onSelect: (name: string, value: string) => any,
	options: Array<Option>,
	value: string
};
