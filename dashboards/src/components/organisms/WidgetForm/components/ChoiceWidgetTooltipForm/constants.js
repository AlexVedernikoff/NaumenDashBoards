// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {LangType} from 'localization/localize_types';

const CHOOSE_OPTIONS: Array<{title: LangType, value: $Keys<typeof DIAGRAM_FIELDS>}> = [
	{
		title: 'WidgetForm::ChoiceWidgetTooltipForm::AtTitle',
		value: DIAGRAM_FIELDS.tooltip
	},
	{
		title: 'WidgetForm::ChoiceWidgetTooltipForm::AtIndicator',
		value: DIAGRAM_FIELDS.indicator
	}
];

export {
	CHOOSE_OPTIONS
};
