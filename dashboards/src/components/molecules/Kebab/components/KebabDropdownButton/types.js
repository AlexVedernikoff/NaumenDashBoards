// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type State = {
	toggle: boolean
};

export type Option = {
	label: string,
	value: string | number
};

export type Props = {
	active: boolean,
	icon: IconName,
	onSelect?: (value: Option) => void,
	options: Array<Option>,
	text: string,
	value?: string | number
};
