// @flow
import {minimize, save} from './helpers';
import type {Sheet as SheetType, SheetColumn, SheetData} from './types';

class Sheet {
	columns = [];
	data = [];

	constructor ({columns, data}: SheetType) {
		this.columns = columns;
		this.data = data;
	}

	create = () => (`
		<html xmlns:x="urn:schemas-microsoft-com:office:excel">
			<head>
				<meta http-equiv="content-type" content="application/csv;charset=utf-8">
				<xml>
					<x:ExcelWorkbook>
						<x:ExcelWorksheets>
							<x:ExcelWorksheet>
								<x:Name />
								<x:WorksheetOptions>
									<x:Panes />
								</x:WorksheetOptions>
							</x:ExcelWorksheet>
						</x:ExcelWorksheets>
					</x:ExcelWorkbook>
				</xml>
			</head>
			<body>
				${this.createTable()}
			</body>
		</html>
	`);

	createFooter = () => `<tr>${this.columns.map(this.createFooterColumn).join('')}</tr>`;

	createFooterColumn = ({Footer}: SheetColumn) => `<td>${Footer}</td>`;

	createHead = () => `<tr>${this.columns.map(this.createHeadColumn).join('')}</tr>`;

	createHeadColumn = ({Header}: SheetColumn) => `<th>${Header}</th>`;

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

const exportSheet = (name: string, data: SheetType) => {
	const sheet = (new Sheet(data)).create();

	const blob = new Blob([minimize(sheet)], {
		type: 'application/csv;charset=utf-8'
	});

	save(blob, name, 'xls');
};

export default exportSheet;
