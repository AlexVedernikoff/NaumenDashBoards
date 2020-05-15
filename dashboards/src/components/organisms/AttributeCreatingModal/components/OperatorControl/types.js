// @flow
import type {ControlType} from 'components/organisms/AttributeCreatingModal/types';

export type Option = {
	icon: string,
	value: string
};

export type Props = {
	index: number,
	name: string,
	onSelect: (index: number, name: string, value: string, type: ControlType) => void,
	options: Array<Option>,
	type: ControlType,
	value: string | null
};

export type State = {
	active: boolean,
	currentOption: Option
};
