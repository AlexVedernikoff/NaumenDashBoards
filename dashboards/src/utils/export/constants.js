// @flow
const PNG: 'png' = 'png';
const PDF: 'pdf' = 'pdf';
const XLSX: 'xlsx' = 'xlsx';

const FILE_VARIANTS = {
	PDF,
	PNG,
	XLSX
};

const DOWNLOAD: 'download' = 'download';
const MAIL: 'mail' = 'mail';

const EXPORT_VARIANTS = {
	DOWNLOAD,
	MAIL
};

const TABLE_NAME_LENGTH_LIMIT = 31;

export {
	EXPORT_VARIANTS,
	FILE_VARIANTS,
	TABLE_NAME_LENGTH_LIMIT
};
