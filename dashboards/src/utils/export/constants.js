// @flow
const PNG: 'png' = 'png';
const PDF: 'pdf' = 'pdf';

const FILE_VARIANTS = {
	PDF,
	PNG
};

const FILE_LIST = [
	{
		key: FILE_VARIANTS.PDF,
		text: FILE_VARIANTS.PDF
	},
	{
		key: FILE_VARIANTS.PNG,
		text: FILE_VARIANTS.PNG
	}
];

const DOWNLOAD: 'download' = 'download';
const MAIL: 'mail' = 'mail';

const EXPORT_VARIANTS = {
	DOWNLOAD,
	MAIL
};

export {
	EXPORT_VARIANTS,
	FILE_LIST,
	FILE_VARIANTS
};
