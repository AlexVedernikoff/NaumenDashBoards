// @flow
import type {Props as SelectProps} from 'components/molecules/TreeSelect/types';

export type Props = SelectProps & {
	onClear?: () => void;
};
