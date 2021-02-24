// @flow
import type {OnChangeEvent} from 'components/types';
import type {Props as LabelProps} from 'components/atoms/Label/types';

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
