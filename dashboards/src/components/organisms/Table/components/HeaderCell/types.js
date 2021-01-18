// @flow
import type {Column, Components} from 'Table/types';
import type {FontStyle, SortingType, TextAlign, TextHandler} from 'store/widgets/data/types';

export type Props = {
	column: Column,
	columnIndex: number,
	components: Components,
	fontColor: string,
	fontStyle?: FontStyle,
	last: boolean,
	left: number,
	onChangeWidth: (width: number, column: Column) => void,
	onClick: (column: Column) => void,
	sorting?: SortingType,
	textAlign: TextAlign,
	textHandler: TextHandler,
	value: string,
	width: number
};
