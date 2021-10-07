// @flow
import type {RangesTypes} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: RangesTypes) => void,
	value: RangesTypes
};
