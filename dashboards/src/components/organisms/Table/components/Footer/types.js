// @flow
import type {Column, ColumnsWidth, Components} from 'Table/types';

export type Props = {
	columns: Array<Column>,
	columnsWidth: ColumnsWidth,
	components: Components,
	fixedColumnsCount: number,
	fixedLeft: number,
	width: number
};
