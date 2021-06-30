// @flow
import {LABEL_FORMATS} from 'store/widgets/data/constants';

const STATE_FORMAT_OPTIONS = [
	{
		label: 'Название',
		value: LABEL_FORMATS.TITLE
	},
	{
		label: 'Код',
		value: LABEL_FORMATS.CODE
	},
	{
		label: 'Название (код)',
		value: LABEL_FORMATS.TITLE_CODE
	}
];

export {
	STATE_FORMAT_OPTIONS
};
