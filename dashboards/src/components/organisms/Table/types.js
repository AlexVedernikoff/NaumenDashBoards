// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {ROW_HEADER_ACCESSOR, ROW_NUM_ACCESSOR} from './constants';
import type {TableWidget} from 'store/widgets/data/types';

export type Props = {
	data: DiagramBuildData,
	onUpdate: TableWidget => void,
	widget: TableWidget
};

type Accessor = typeof ROW_HEADER_ACCESSOR | typeof ROW_NUM_ACCESSOR | string;

export type Column = {
	accessor: Accessor,
	footer: string,
	header: string
};

export type Row = {
	[accessor: Accessor]: string
};

export type Data = Array<Row>;

export type State = {
	columns: Array<Column>,
	columnsWidth: Array<number>,
	data: Array<Row>,
	page: number,
	pageSize: number,
	usesMSInterval: boolean,
	width: number
};

export type RenderValue = (value: number | string) => number | string;
