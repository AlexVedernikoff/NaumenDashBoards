// @flow
import {DEFAULT_TABLE_VALUE, DISPLAY_MODE, FONT_STYLES, SORTING_TYPES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import type {LangType} from 'localization/localize_types';
import type {State} from './types';

const DEFAULT_PRESET_COLOR = '#F2F2F2';

const PRESET_COLORS = [
	{
		previewColor: '#E6E6E6',
		value: '#F2F2F2'
	},
	{
		previewColor: '#BBBBBB',
		value: '#EEEEEE'
	},
	{
		previewColor: '#C0D7EB',
		value: '#E1EDF7'
	},
	{
		previewColor: '#D1CAEC',
		value: '#EBE8F6'
	},
	{
		previewColor: '#E6BDE6',
		value: '#F6E8F6'
	},
	{
		previewColor: '#E9C0C0',
		value: '#F6E8E8'
	},
	{
		previewColor: '#EAD0A5',
		value: '#F6EBD9'
	},
	{
		previewColor: '#EEE3AA',
		value: '#FAF6E2'
	},
	{
		previewColor: '#BFD1B0',
		value: '#E6EDE0'
	},
	{
		previewColor: '#BAD7CE',
		value: '#DBEDE7'
	}
];

const USER_MODE: $Shape<State> = {
	displayMode: DISPLAY_MODE.ANY
};

const DEFAULT_TABLE_SORTING = {
	accessor: null,
	type: SORTING_TYPES.ASC
};

const ROW_HEIGHT = 32;

const DEFAULT_CELL_SETTINGS = Object.freeze({
	fontColor: 'black',
	fontStyle: undefined
});

const DEFAULT_HEADER_CELL_SETTINGS = Object.freeze({
	...DEFAULT_CELL_SETTINGS,
	textAlign: TEXT_ALIGNS.center,
	textHandler: TEXT_HANDLERS.CROP
});

const DEFAULT_PARAMETER_CELL_SETTINGS = Object.freeze({
	fontColor: 'black',
	fontStyle: FONT_STYLES.BOLD
});

const DEFAULT_PIVOT_SETTINGS = {
	body: {
		defaultValue: {
			label: ('TableWidgetForm::BodySettingsBox::ShowEmptyString': LangType),
			value: DEFAULT_TABLE_VALUE.EMPTY_ROW
		},
		indicatorSettings: DEFAULT_CELL_SETTINGS,
		pageSize: 0,
		parameterRowColor: DEFAULT_PRESET_COLOR,
		parameterSettings: DEFAULT_PARAMETER_CELL_SETTINGS,
		showRowNum: false,
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP
	},
	columnHeader: DEFAULT_HEADER_CELL_SETTINGS
};

export {
	DEFAULT_PRESET_COLOR,
	PRESET_COLORS,
	USER_MODE,
	DEFAULT_TABLE_SORTING,
	ROW_HEIGHT,
	DEFAULT_PIVOT_SETTINGS
};
