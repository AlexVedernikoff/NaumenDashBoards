// @flow
import type {PivotBodySettings} from 'src/store/widgets/data/types';
import type {PivotColumn, PivotDataRow} from 'utils/recharts/types';
import type {PivotFormatter} from 'utils/recharts/formater/types';

export type Filters = {[parameter: string]: string};

export type Props = {
	columns: Array<PivotColumn>,
	columnsWidth: Array<number>,
	filter: Filters,
	formatters: PivotFormatter,
	index: string,
	level: number,
	row: PivotDataRow,
	style: PivotBodySettings,
};

export type State = {
	showChildren: boolean
};

export type ParameterStyle = {
	backgroundColor: string,
	flex: string,
	paddingLeft: string
};

export type CellStyle = {
	backgroundColor: string,
	flex: string
};
