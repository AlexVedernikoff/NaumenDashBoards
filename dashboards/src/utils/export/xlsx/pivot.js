// @flow
import {baseColumnToPivotBaseColumn, pivotColumnToPivotBaseColumn} from './helpers';
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import {parseColumns, parseColumnsFlat, parseMetadata} from 'utils/recharts/pivot.helpers';
import type {PivotBaseColumn, Row} from 'store/widgets/buildData/types';
import type {PivotWidget} from 'store/widgets/data/types';
import Table from './table';
import type {TableData} from 'utils/export/types';

class PivotTable extends Table {
	widget: PivotWidget;
	parametersLength: number;
	topParameterAccessor: string;
	topParameterValues: Array<string>;
	headers: Array<PivotBaseColumn>;
	dataColumns: Array<PivotBaseColumn>;

	constructor (data: TableData, widget: PivotWidget) {
		super(data);
		this.widget = widget;

		const parameters = data.columns.filter(column => column.type === COLUMN_TYPES.PARAMETER);

		this.parametersLength = parameters.length;
		this.topParameterAccessor = parameters[0]?.accessor;
		this.topParameterValues = [];

		let prevTopParameterValue = null;

		// eslint-disable-next-line no-unused-vars
		for (const row of this.data) {
			const topParameterValue = row[this.topParameterAccessor];

			if (prevTopParameterValue !== topParameterValue) {
				this.topParameterValues.push(topParameterValue);
				prevTopParameterValue = topParameterValue;
			}
		}

		const metadata = parseMetadata(data);
		const {columns: headers, totalHeight} = parseColumns(widget, data, metadata.breakdown, {});
		const parametersColumns = this.columns
			.filter(column => column.type === COLUMN_TYPES.PARAMETER)
			.map(baseColumnToPivotBaseColumn(totalHeight));

		this.headers = [
			...parametersColumns,
			...headers.slice(1).map(pivotColumnToPivotBaseColumn)
		];

		this.dataColumns = [
			...parametersColumns,
			...parseColumnsFlat(headers).slice(1).map(pivotColumnToPivotBaseColumn)
		];

		this.updateData();
	}

	createHead = (): string => {
		const rows = [];
		let nextRow = this.headers;

		while (nextRow.length > 0) {
			const currentRow = nextRow;
			const cells = [];

			nextRow = [];

			currentRow.forEach(column => {
				if (column.columns) {
					column.columns.forEach(c => nextRow.push(c));
				}

				cells.push(`<th width="150px" rowspan="${column.height}" colspan="${column.width}">${column.header}</th>`);
			});

			rows.push(`<tr>${cells.join('')}</tr>`);
		}

		return rows.join('');
	};

	createRows = (): string => {
		if (this.parametersLength === 0) {
			return super.createRows();
		}

		const result = [];

		this.topParameterValues.forEach(topValue => {
			const subDataSet = this.data.filter(row => row[this.topParameterAccessor] === topValue);

			result.push(this.createSumRow(topValue, subDataSet));
			subDataSet.forEach(row => {
				result.push(this.createRow(row));
			});
		});

		return result.join('');
	};

	createSumRow = (parameterValue: string, subDataSet: Array<Row>): string => {
		const parameter = `<th>${parameterValue}</th>`;
		const dataColumns = this.dataColumns.filter(column => column.type === COLUMN_TYPES.INDICATOR);
		const data = {};

		dataColumns.forEach(column => { data[column.accessor] = 0; });

		subDataSet.forEach(row => {
			dataColumns.forEach(column => {
				const value = parseFloat(row[column.accessor]);

				if (!isNaN(value)) {
					data[column.accessor] += value;
				}
			});
		});

		const appendix = '<th></th>'.repeat(this.parametersLength - 1);
		const values = dataColumns.map(column => `<th>${data[column.accessor]}</th>`).join('');

		return `<tr>${parameter}${appendix}${values}</tr>`;
	};

	getDataColumns = (): Array<PivotBaseColumn> => this.dataColumns;

	updateData = () => {
		const calcColumns = this.dataColumns.filter(column => column.sumKeys);

		this.data.forEach(row => {
			calcColumns.forEach(({accessor, sumKeys}) => {
				if (sumKeys) {
					const sum = sumKeys.reduce((acc, key) => {
						const value = parseFloat(row[key]);
						return acc + (isNaN(value) ? 0 : value);
					}, 0);

					row[accessor] = sum.toString();
				}
			});
		});
	};
}

export default PivotTable;
