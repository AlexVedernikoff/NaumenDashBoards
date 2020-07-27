// @flow
import {FILE_VARIANTS} from 'utils/export';
import {LAYOUT_MODE} from 'store/dashboard/constants';

const EXPORT_LIST = [
	{
		key: FILE_VARIANTS.PDF,
		text: FILE_VARIANTS.PDF
	},
	{
		key: FILE_VARIANTS.PNG,
		text: FILE_VARIANTS.PNG
	},
	{
		key: FILE_VARIANTS.XLSX,
		text: FILE_VARIANTS.XLSX
	}
];

const LAYOUT_MODE_OPTIONS = [
	{
		label: 'Web приложение',
		value: LAYOUT_MODE.WEB
	},
	{
		label: 'Везде',
		value: LAYOUT_MODE.WEB_MK
	},
	{
		label: 'Мобильное приложение',
		value: LAYOUT_MODE.MK
	}
];

export {
	EXPORT_LIST,
	LAYOUT_MODE_OPTIONS
};
