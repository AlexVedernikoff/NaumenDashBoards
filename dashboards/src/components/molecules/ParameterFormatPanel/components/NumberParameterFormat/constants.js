// @flow
import type {LangType} from 'localization/localize_types';
import {NOTATION_FORMATS} from 'store/widgets/data/constants';

const NOTATION_FORMATS_OPTIONS: Array<{label: LangType, value: $Keys<typeof NOTATION_FORMATS>}> = [
	{label: 'Formatter::Thousand', value: NOTATION_FORMATS.THOUSAND},
	{label: 'Formatter::Million', value: NOTATION_FORMATS.MILLION},
	{label: 'Formatter::Billion', value: NOTATION_FORMATS.BILLION},
	{label: 'Formatter::Trillion', value: NOTATION_FORMATS.TRILLION}
];

export {
	NOTATION_FORMATS_OPTIONS
};
