// @flow
import type {LangType} from 'localization/localize_types';

const OPTIONS = 'OPTIONS';
const PARAMS = 'PARAMS';
const STYLE = 'STYLE';

const TAB_TYPES = {
	OPTIONS,
	PARAMS,
	STYLE
};

const TABS: Array<{key: $Keys<typeof TAB_TYPES>, title: LangType}> = [
	{
		key: PARAMS,
		title: 'DiagramWidgetForm::Parameters'
	},
	{
		key: STYLE,
		title: 'DiagramWidgetForm::Style'
	},
	{
		key: OPTIONS,
		title: 'DiagramWidgetForm::Options'
	}
];

const REGULAR_TABS: Array<{key: $Keys<typeof TAB_TYPES>, title: LangType}> = [
	{
		key: PARAMS,
		title: 'DiagramWidgetForm::Parameters'
	},
	{
		key: STYLE,
		title: 'DiagramWidgetForm::Style'
	}
];

export {
	REGULAR_TABS,
	TAB_TYPES,
	TABS
};
