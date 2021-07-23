// @flow
import type {OnChangeEvent} from 'components/types';
import type {Props as BaseLabelProps} from 'components/atoms/Label/types';

export type LabelProps = {
	name: string
} & BaseLabelProps;

export type Components = {
	Label: React$ComponentType<LabelProps>
};

export type Props = {
	components?: $Shape<Components>,
	label: string,
	name: string,
	onChange: (event: OnChangeEvent<string>) => void,
	onRemove?: (name: string) => void,
	removable: boolean,
	value: string
};

export type State = {
	showPicker: boolean
};
