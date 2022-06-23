// @flow
import type {DivRef} from 'components/types';

export type Props = {
	children: React$Node,
	className: string,
	error: string,
	forwardedRef: DivRef | null,
	label: string,
	row: boolean,
	small: boolean
};
