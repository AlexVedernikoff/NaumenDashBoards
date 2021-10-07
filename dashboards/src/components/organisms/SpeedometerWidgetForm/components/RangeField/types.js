// @flow
import type {Range, RangesTypes} from 'store/widgets/data/types';

export type Props = {
	index: number,
	onChange: (index: number, range: Range) => void,
	onRemove: (index: number) => void,
	range: Range,
	removable: boolean,
	type: RangesTypes
};
