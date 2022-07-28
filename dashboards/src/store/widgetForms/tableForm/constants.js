// @flow
import {DEFAULT_TABLE_VALUE, DISPLAY_MODE, SORTING_TYPES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import type {LangType} from 'localization/localize_types';
import type {State} from './types';

const USER_MODE: $Shape<State> = {
	displayMode: DISPLAY_MODE.ANY
};

const DEFAULT_CELL_SETTINGS = Object.freeze({
	fontColor: 'black',
	fontStyle: undefined
});

const DEFAULT_HEADER_CELL_SETTINGS = Object.freeze({
	...DEFAULT_CELL_SETTINGS,
	textAlign: TEXT_ALIGNS.center,
	textHandler: TEXT_HANDLERS.CROP
});

const DEFAULT_TABLE_SETTINGS = {
	body: {
		defaultValue: {
			label: ('TableWidgetForm::BodySettingsBox::ShowEmptyString': LangType),
			value: DEFAULT_TABLE_VALUE.EMPTY_ROW
		},
		indicatorSettings: DEFAULT_CELL_SETTINGS,
		pageSize: 20,
		parameterSettings: DEFAULT_CELL_SETTINGS,
		showRowNum: true,
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP
	},
	columnHeader: DEFAULT_HEADER_CELL_SETTINGS
};

const DEFAULT_TABLE_SORTING = {
	accessor: null,
	type: SORTING_TYPES.ASC
};

const ROW_HEIGHT = 32;

export {
	DEFAULT_TABLE_SETTINGS,
	DEFAULT_TABLE_SORTING,
	ROW_HEIGHT,
	USER_MODE
};
