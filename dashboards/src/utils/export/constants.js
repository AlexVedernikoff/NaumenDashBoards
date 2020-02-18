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

export {
	EXPORT_VARIANTS,
	FILE_VARIANTS
};
