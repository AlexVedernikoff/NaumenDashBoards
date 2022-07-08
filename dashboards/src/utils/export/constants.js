// @flow
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const PNG: 'png' = 'png';
const PDF: 'pdf' = 'pdf';
const XLSX: 'xlsx' = 'xlsx';

const FILE_VARIANTS = {
	PDF,
	PNG,
	XLSX
};

const TABLE_NAME_LENGTH_LIMIT = 31;

const DEFAULT_CREATE_IMAGE_OPTIONS = {
	addBackgroundColor: true,
	backgroundColor: '#FFF',
	scale: 3
};

const DEFAULT_EXPORT_PNG_OPTIONS = {
	addBackgroundColor: true,
	name: '',
	toDownload: false
};

const DEFAULT_EXPORT_PDF_OPTIONS = {
	name: '',
	toDownload: false
};

const DEFAULT_CREATE_PDF_OPTIONS = {
	name: '',
	toDownload: false
};

const NEED_SCALE_WIDGET_TYPES = [
	WIDGET_TYPES.BAR,
	WIDGET_TYPES.BAR_STACKED,
	WIDGET_TYPES.COLUMN,
	WIDGET_TYPES.COLUMN_STACKED,
	WIDGET_TYPES.COMBO,
	WIDGET_TYPES.DONUT,
	WIDGET_TYPES.LINE,
	WIDGET_TYPES.PIE,
	WIDGET_TYPES.TABLE
];

export {
	DEFAULT_CREATE_IMAGE_OPTIONS,
	DEFAULT_CREATE_PDF_OPTIONS,
	DEFAULT_EXPORT_PDF_OPTIONS,
	DEFAULT_EXPORT_PNG_OPTIONS,
	FILE_VARIANTS,
	NEED_SCALE_WIDGET_TYPES,
	TABLE_NAME_LENGTH_LIMIT
};
