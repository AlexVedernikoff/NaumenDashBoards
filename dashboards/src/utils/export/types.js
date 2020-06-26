// @flow
export type Options = {
	container: HTMLDivElement,
	fragment: boolean,
	name: string,
	toDownload: boolean,
	type: string
};

export type SheetColumn = {
	accessor: string,
	footer: string,
	header: string
};

export type SheetData = {
	[string]: string
};

export type Sheet = {
	columns: Array<SheetColumn>,
	data: Array<SheetData>
};
