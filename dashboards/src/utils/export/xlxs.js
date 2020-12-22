// @flow
import {save} from './helpers';
import type {TableColumn, TableData, TableRow} from './types';
import {TABLE_NAME_LENGTH_LIMIT} from './constants';
import XLSX from 'xlsx';

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

	createFooter = () => `<tr>${this.columns.map(this.createFooterColumn).join('')}</tr>`;

	createFooterColumn = ({footer}: TableColumn) => `<td>${footer}</td>`;

	createHead = () => (`
		<tr>${this.columns.map(this.createHeadColumn).join('')}</tr>
		${this.createSubHead()}
	`);

	createHeadColumn = ({columns, header}: TableColumn) => {
		let rowspan = this.usesSubColumns && !Array.isArray(columns) ? 2 : 1;
		let colspan = this.usesSubColumns && Array.isArray(columns) ? columns.length : 1;

		return `<th colspan="${colspan}" rowspan="${rowspan}">${header}</th>`;
	};

	createRow = (row: TableRow) => `<tr>${this.getDataColumns().map(column => this.createRowColumn(column, row)).join('')}</tr>`;

	createRowColumn = (column: TableColumn, row: TableRow) => `<td>${row[column.accessor] || ''}</td>`;

	createRows = () => this.data.map(this.createRow).join('');

	createSubHead = () => {
		return this.usesSubColumns ? `<tr>${this.getSubColumns().map(this.createSubheadColumn).join('')}</tr>` : '';
	};

	createSubheadColumn = ({header}: TableColumn) => `<th>${header}</th>`;

	createTable = () => (`
		<table>
			${this.createHead()}
			${this.createRows()}
			${this.createFooter()}
		</table>
	`);

	getDataColumns = () => this.columns.reduce((columns, column) => {
		return Array.isArray(column.columns) ? [...columns, ...column.columns] : [...columns, column];
	}, []);

	getSubColumns = () => {
		return this.columns.reduce((columns, column) => {
			return Array.isArray(column.columns) ? [...columns, ...column.columns] : columns;
		}, []);
	};
}

const stringToArrayBuffer = (s: string) => {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);

	for (let i = 0; i < s.length; i++) {
		view[i] = s.charCodeAt(i) & 0xFF;
	}

	return buf;
};

const exportSheet = (name: string, data: TableData) => {
	const table = (new Table(data)).create();
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
