// @flow
import type {Option, Props as SelectProps} from 'components/molecules/Select/types';

export type Props = {
	isEditingLabel: boolean,
	maxLabelLength: number | null,
	onClear?: () => void,
	onLoadOptions: () => void,
	onRemove?: (index: number) => void,
	values: Array<Option>,
} & SelectProps;
