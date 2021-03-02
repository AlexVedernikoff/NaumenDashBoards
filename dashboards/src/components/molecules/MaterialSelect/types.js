// @flow
import type {Props as SelectProps} from 'components/molecules/Select/types';

export type Props = {
	onClear?: () => void,
	onRemove?: (value: string) => void,
} & SelectProps;
