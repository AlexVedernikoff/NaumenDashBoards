// @flow
import type {PivotColumn} from 'utils/recharts/types';
import type {PivotFormatter} from 'utils/recharts/formater/types';
import type {PivotHeaderSettings} from 'src/store/widgets/data/types';

export type Props = {
	columnsWidth: Array<number>,
	formatters: PivotFormatter,
	headers: Array<PivotColumn>,
	headHeight: number,
	onChangeColumnsWidth: (columnsWidth: Array<number>) => void,
	style: PivotHeaderSettings
};
