// @flow
import type {BaseColumn, PivotBuildData, TableBuildData} from 'store/widgets/buildData/types';
import PivotTable from './pivot';
import type {PivotWidget, TableWidget} from 'store/widgets/data/types';
import {save} from 'utils/export/helpers';
import {stringToArrayBuffer} from './helpers';
import Table from './table';
import type {TableData} from 'utils/export/types';
import {TABLE_NAME_LENGTH_LIMIT} from 'utils/export/constants';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const exportSheet = async (name: string, data: PivotBuildData | TableBuildData, widget: PivotWidget | TableWidget) => {
	const columnsArray: Array<BaseColumn> = [];

	data.columns.forEach(column => {
		const {accessor, columns, type, footer = '', header = '', tooltip = {show: false, title: ''}} = column;

		columnsArray.push({accessor, columns, footer, header, tooltip, type});
	});

	const tableData: TableData = {...data, columns: columnsArray};
	const table = widget.type === WIDGET_TYPES.PIVOT_TABLE ? new PivotTable(tableData, widget) : new Table(tableData);
	const tableElement = table.create();

	if (tableElement) {
		const XLSX = await import('xlsx');
		const workbook = XLSX.utils.book_new();
		const sheet = XLSX.utils.table_to_sheet(tableElement);
		let tableName = name;

		if (tableName.length >= TABLE_NAME_LENGTH_LIMIT) {
			tableName = `${tableName.substring(0, 27)}...`;
		}

		const badChars = /[\][*?/\\]/ig;

		if (badChars.test(tableName)) {
			tableName = tableName.replace(badChars, '_');
		}

		XLSX.utils.book_append_sheet(workbook, sheet, tableName);

		const file = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});
		const blob = new Blob([stringToArrayBuffer(file)], {
			type: 'application/octet-stream;charset=utf-8'
		});

		save(blob, name, 'xlsx');
	}
};

export default exportSheet;
