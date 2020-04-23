// @flow
import {EMPTY_TABLE_DATA, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';

const DEFAULT_TABLE_SETTINGS = {
	body: {
		emptyData: {
			label: 'Показывать "-"',
			value: EMPTY_TABLE_DATA.DASH
		},
		showRowNum: false,
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP
	},
	columnHeader: {
		fontColor: 'black',
		fontStyle: undefined
	},
	rowHeader: {
		fontColor: 'black',
		fontStyle: undefined
	}
};

export {
	DEFAULT_TABLE_SETTINGS
};
