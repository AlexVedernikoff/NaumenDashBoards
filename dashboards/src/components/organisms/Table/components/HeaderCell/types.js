// @flow
import type {Column} from 'Table/types';
import type {FontStyle, SortingType} from 'store/widgets/data/types';

export type Props = {
	column: Column,
	columnIndex: number,
	fontColor: string,
	fontStyle?: FontStyle,
	onChangeWidth: (width: number, index: number) => void,
	onClick: (index: number) => void,
	sorting?: SortingType,
	value: string,
	width: number
};
