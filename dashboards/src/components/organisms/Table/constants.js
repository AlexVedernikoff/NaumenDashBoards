// @flow
import {DEFAULT_TABLE_VALUE, SORTING_TYPES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';

const DEFAULT_TABLE_SETTINGS = {
	body: {
		defaultValue: {
			label: 'Показывать " "',
			value: DEFAULT_TABLE_VALUE.EMPTY_ROW
		},
		showRowNum: true,
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

const DEFAULT_TABLE_SORTING = {
	column: null,
	type: SORTING_TYPES.ASC
};

const ROW_HEADER_ACCESSOR = 'breakdownTitle';

const ROW_NUM_ACCESSOR = 'rowNum';

const ROW_NUM_COLUMN = {
	accessor: ROW_NUM_ACCESSOR,
	footer: '',
	header: ''
};

export {
	DEFAULT_TABLE_SETTINGS,
	DEFAULT_TABLE_SORTING,
	ROW_HEADER_ACCESSOR,
	ROW_NUM_COLUMN,
	ROW_NUM_ACCESSOR
};