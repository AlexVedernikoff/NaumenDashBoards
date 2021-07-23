// @flow
import type {Props as SelectProps} from 'components/molecules/Select/types';

export type Props = {
	...SelectProps,
	usesAuto: boolean
};

export type State = {
	options: Array<string | number>
};
