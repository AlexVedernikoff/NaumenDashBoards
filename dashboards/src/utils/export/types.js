// @flow
import type {BaseColumn, Row} from 'store/widgets/buildData/types';

export type TableData = {
	columns: Array<BaseColumn>,
	data: Array<Row>
};
