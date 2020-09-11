// @flow
import type {Column, Components} from 'Table/types';

export type Props = {
	columns: Array<Column>,
	columnsWidth: Array<number>,
	components: Components,
	width: number
};
