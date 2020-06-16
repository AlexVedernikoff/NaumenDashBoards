// @flow
import type {Column, RenderValue} from 'Table/types';

export type Props = {
	columns: Array<Column>,
	columnsWidth: Array<number>,
	renderValue: RenderValue,
	width: number
};
