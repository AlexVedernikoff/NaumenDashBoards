// @flow
import type {BaseColumn, Row} from 'store/widgets/buildData/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export type TableData = {
	columns: Array<BaseColumn>,
	data: Array<Row>
};

export type CreateImageOptions = $Shape<{
	addBackgroundColor: boolean,
	backgroundColor: string,
	scale: number
}>;

export type ExportPNGOptions = {
	addBackgroundColor?: boolean,
	name: string,
	toDownload?: boolean
};

export type ExportPDFOptions = {
	name: string,
	toDownload?: boolean
};

export type CreatePdfImage = {
	image: HTMLCanvasElement,
	scale: number
};

export type CreatePdfOptions = {
	name: string,
	toDownload?: boolean
};

export type WidgetStoreItem = {
	container: HTMLDivElement,
	type: $Keys<typeof WIDGET_TYPES>
};
