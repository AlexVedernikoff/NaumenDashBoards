// @flow
import {LABEL_FORMATS} from 'store/widgets/data/constants';
import type {LangType} from 'localization/localize_types';

const STATE_FORMAT_OPTIONS: Array<{label: LangType, value: $Keys<typeof LABEL_FORMATS>}> = [
	{
		label: 'LabelParameterFormat::Title',
		value: LABEL_FORMATS.TITLE
	},
	{
		label: 'LabelParameterFormat::Code',
		value: LABEL_FORMATS.CODE
	},
	{
		label: 'LabelParameterFormat::TitleCode',
		value: LABEL_FORMATS.TITLE_CODE
	}
];

export {
	STATE_FORMAT_OPTIONS
};
