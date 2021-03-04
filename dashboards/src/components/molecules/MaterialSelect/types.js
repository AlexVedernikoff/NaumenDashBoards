// @flow
import type {Props as SelectProps} from 'components/molecules/Select/types';

export type Props = {
	isEditingLabel: boolean,
	maxLabelLength: number | null,
	onChangeLabel?: (name: string, label: string) => void,
	onClear?: () => void,
	onRemove?: (value: string) => void,
} & SelectProps;
