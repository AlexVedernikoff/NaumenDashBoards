// @flow
import type {BaseColumn, Row} from 'store/widgets/buildData/types';

export type Options = {
	container: HTMLDivElement,
	fragment?: boolean,
	name: string,
	toDownload?: boolean,
	type: string
};

export type TableData = {
	columns: Array<BaseColumn>,
	data: Array<Row>
};
