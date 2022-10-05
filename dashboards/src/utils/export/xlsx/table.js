// @flow
import type {BaseColumn, PivotBaseColumn, Row} from 'store/widgets/buildData/types';
import type {TableData} from 'utils/export/types';

class Table {
	columns = [];
	usesSubColumns = false;
	data = [];

	constructor ({columns, data}: TableData) {
		this.columns = columns;
		this.usesSubColumns = this.columns.filter(({columns}) => Array.isArray(columns)).length > 0;
		this.data = data;
	}

	create = (): ?Node => {
		const container = document.createElement('div');

		container.innerHTML = this.createTable().trim();

		return container.firstChild;
	};

	createFooter = (): string => `<tr>${this.getDataColumns().map(this.createFooterCell).join('')}</tr>`;

	createFooterCell = ({footer}: BaseColumn | PivotBaseColumn): string => `<td>${footer}</td>`;

	createHead = (): string => (`
		<tr>${this.columns.map(this.createHeadCell).join('')}</tr>
		${this.createSubHead()}
	`);

	createHeadCell = ({columns, header}: BaseColumn): string => {
		const rowSpan = this.usesSubColumns && !Array.isArray(columns) ? 2 : 1;
		const colSpan = this.usesSubColumns && Array.isArray(columns) ? columns.length : 1;

		return `<th colspan="${colSpan}" rowspan="${rowSpan}">${header}</th>`;
	};

	createRow = (row: Row): string => `<tr>${this.getDataColumns().map(column => this.createRowCell(column, row)).join('')}</tr>`;

	createRowCell = (column: BaseColumn | PivotBaseColumn, row: Row): string => `<td>${row[column.accessor] || ''}</td>`;

	createRows = (): string => this.data.map(this.createRow).join('');

	createSubHead = (): string => this.usesSubColumns ? `<tr>${this.getSubColumns().map(this.createSubheadColumn).join('')}</tr>` : '';

	createSubheadColumn = ({header}: BaseColumn): string => `<th>${header}</th>`;

	createTable = (): string => (`
		<table>
			${this.createHead()}
			${this.createRows()}
			${this.createFooter()}
		</table>
	`);

	getDataColumns = (): Array<BaseColumn> =>
		this.columns.reduce((columns, column) => Array.isArray(column.columns) ? [...columns, ...column.columns] : [...columns, column], []);

	getSubColumns = (): Array<BaseColumn> =>
		this.columns.reduce((columns, column) => Array.isArray(column.columns) ? [...columns, ...column.columns] : columns, []);
}

export default Table;
