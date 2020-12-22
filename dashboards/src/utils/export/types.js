// @flow
export type Options = {
	container: HTMLDivElement,
	fragment?: boolean,
	name: string,
	toDownload?: boolean,
	type: string
};

export type TableColumn = {
	accessor: string,
	columns?: Array<TableColumn>,
	footer: string,
	header: string
};

export type TableRow = {
	[string]: string
};

export type TableData = {
	columns: Array<TableColumn>,
	data: Array<TableRow>
};
