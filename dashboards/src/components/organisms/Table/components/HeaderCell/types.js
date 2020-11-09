// @flow
import type {Column, Components} from 'Table/types';
import type {FontStyle, SortingType} from 'store/widgets/data/types';

export type Props = {
	column: Column,
	columnIndex: number,
	components: Components,
	fontColor: string,
	fontStyle?: FontStyle,
	onChangeWidth: (width: number, column: Column) => void,
	onClick: (column: Column) => void,
	sorting?: SortingType,
	value: string,
	width: number
};
