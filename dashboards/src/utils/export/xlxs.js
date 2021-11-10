// @flow
import type {BaseColumn, Row, TableBuildData} from 'store/widgets/buildData/types';
import {save} from './helpers';
import type {TableData} from './types';
import {TABLE_NAME_LENGTH_LIMIT} from './constants';

class Table {
	columns = [];
	usesSubColumns = false;
	data = [];

	constructor ({columns, data}: TableData) {
		this.columns = columns;
		this.usesSubColumns = this.columns.filter(({columns}) => Array.isArray(columns)).length > 0;
		this.data = data;
	}

	create = () => {
		const container = document.createElement('div');

		container.innerHTML = this.createTable().trim();

		return container.firstChild;
	};

	createFooter = () => `<tr>${this.getDataColumns().map(this.createFootrCell).join('')}</tr>`;

	createFootrCell = ({footer}: BaseColumn) => `<td>${footer}</td>`;

	createHead = () => (`
		<tr>${this.columns.map(this.createHeadCell).join('')}</tr>
		${this.createSubHead()}
	`);

	createHeadCell = ({columns, header}: BaseColumn) => {
		const rowspan = this.usesSubColumns && !Array.isArray(columns) ? 2 : 1;
		const colspan = this.usesSubColumns && Array.isArray(columns) ? columns.length : 1;

		return `<th colspan="${colspan}" rowspan="${rowspan}">${header}</th>`;
	};

	createRow = (row: Row) => `<tr>${this.getDataColumns().map(column => this.createRowCell(column, row)).join('')}</tr>`;

	createRowCell = (column: BaseColumn, row: Row) => `<td>${row[column.accessor] || ''}</td>`;

	createRows = () => this.data.map(this.createRow).join('');

	createSubHead = () => this.usesSubColumns ? `<tr>${this.getSubColumns().map(this.createSubheadColumn).join('')}</tr>` : '';

	createSubheadColumn = ({header}: BaseColumn) => `<th>${header}</th>`;

	createTable = () => (`
		<table>
			${this.createHead()}
			${this.createRows()}
			${this.createFooter()}
		</table>
	`);

	getDataColumns = () =>
		this.columns.reduce((columns, column) => Array.isArray(column.columns) ? [...columns, ...column.columns] : [...columns, column], []);

	getSubColumns = () =>
		this.columns.reduce((columns, column) => Array.isArray(column.columns) ? [...columns, ...column.columns] : columns, []);
}

const stringToArrayBuffer = (s: string) => {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);

	for (let i = 0; i < s.length; i++) {
		view[i] = s.charCodeAt(i) & 0xFF;
	}

	return buf;
};

const exportSheet = async (name: string, data: TableBuildData) => {
	const columnsArray: Array<BaseColumn> = [];

	data.columns.forEach(column => {
		const {accessor, columns, footer = '', header = ''} = column;

		columnsArray.push({accessor, columns, footer, header});
	});

	const tableData: TableData = {...data, columns: columnsArray};
	const table = (new Table(tableData)).create();
	const XLSX = await import('xlsx');
	const workbook = XLSX.utils.book_new();
	const sheet = XLSX.utils.table_to_sheet(table);
	let tableName = name;

	if (tableName.length >= TABLE_NAME_LENGTH_LIMIT) {
		tableName = `${tableName.substring(0, 27)}...`;
	}

	XLSX.utils.book_append_sheet(workbook, sheet, tableName);

	const file = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});
	const blob = new Blob([stringToArrayBuffer(file)], {
		type: 'application/octet-stream;charset=utf-8'
	});

	save(blob, name, 'xlsx');
};

export default exportSheet;
