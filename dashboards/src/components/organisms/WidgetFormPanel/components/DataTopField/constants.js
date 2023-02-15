// @flow
import type {LangType} from 'localization/localize_types';
import {MODE_OF_TOP} from 'store/widgets/data/constants';

const COUNT_OPTIONS = [
	5,
	10,
	15,
	20,
	25,
	50,
	100
];

const MODE_OF_TOP_OPTIONS: Array<{title: LangType, value: $Keys<typeof MODE_OF_TOP>}> = [
	{
		title: 'DataTopField::Max',
		value: MODE_OF_TOP.MAX
	},
	{
		title: 'DataTopField::Min',
		value: MODE_OF_TOP.MIN
	}
];

export {
	MODE_OF_TOP_OPTIONS,
	COUNT_OPTIONS
};
