// @flow
import type {Column, ColumnsWidth, Components, FixedPositions} from 'Table/types';
import type {Ref} from 'components/types';

export type Props = {
	columns: Array<Column>,
	columnsWidth: ColumnsWidth,
	components: Components,
	fixedPositions: FixedPositions,
	forwardedRef: Ref<'div'>,
	scrollBarWidth: number,
	width: number
};
