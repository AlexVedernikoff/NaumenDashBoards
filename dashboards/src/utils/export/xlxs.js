// @flow
import {save} from './helpers';
import type {Sheet as SheetType, SheetColumn, SheetData} from './types';
import XLSX from 'xlsx';

class Sheet {
	columns = [];
	data = [];

	constructor ({columns, data}: SheetType) {
		this.columns = columns;
		this.data = data;
	}

	create = () => {
		const container = document.createElement('div');
		container.innerHTML = this.createTable().trim();

		return container.firstChild;
	};

	createFooter = () => `<tr>${this.columns.map(this.createFooterColumn).join('')}</tr>`;

	createFooterColumn = ({footer}: SheetColumn) => `<td>${footer}</td>`;

	createHead = () => `<tr>${this.columns.map(this.createHeadColumn).join('')}</tr>`;

	createHeadColumn = ({header}: SheetColumn) => `<th>${header}</th>`;

	createRow = (row) => `<tr>${this.columns.map(column => this.createRowColumn(column, row)).join('')}</tr>`;

	createRowColumn = (column: SheetColumn, row: SheetData) => `<td>${row[column.accessor] || ''}</td>`;

	createRows = () => this.data.map(this.createRow).join('');

	createTable = () => (`
			<table>
				${this.createHead()}
				${this.createRows()}
				${this.createFooter()}
			</table>
	`);
}

const stringToArrayBuffer = (s: string) => {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);

	for (let i = 0; i < s.length; i++) {
		view[i] = s.charCodeAt(i) & 0xFF;
	}

	return buf;
};

const exportSheet = (name: string, data: SheetType) => {
	const table = (new Sheet(data)).create();
	const workbook = XLSX.utils.book_new();
	const sheet = XLSX.utils.table_to_sheet(table);

	XLSX.utils.book_append_sheet(workbook, sheet, name);

	const file = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});
	const blob = new Blob([stringToArrayBuffer(file)], {
		type: 'application/octet-stream;charset=utf-8'
	});

	save(blob, name, 'xlsx');
};

export default exportSheet;
