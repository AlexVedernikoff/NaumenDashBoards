// @flow
import type {Option, Props as SelectProps} from 'components/molecules/Select/types';

export type Props = {
	isEditingLabel: boolean,
	maxLabelLength: number | null,
	onClear?: () => void,
	onRemove?: (value: string) => void,
	values: Array<Option>
} & SelectProps;
