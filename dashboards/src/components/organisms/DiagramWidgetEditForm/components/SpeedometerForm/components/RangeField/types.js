// @flow
import type {Range} from 'store/widgets/data/types';

export type Props = {
	index: number,
	onChange: (index: number, range: Range) => void,
	onChangeToRange: (index: number, value: string) => void,
	onRemove: (index: number) => void,
	range: Range,
	removable: boolean,
	usePercent: boolean
};
