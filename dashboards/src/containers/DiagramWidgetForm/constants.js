// @flow
const OPTIONS = 'OPTIONS';
const PARAMS = 'PARAMS';
const STYLE = 'STYLE';

const TAB_TYPES = {
	OPTIONS,
	PARAMS,
	STYLE
};

const TABS = [
	{
		key: PARAMS,
		title: 'Параметры'
	},
	{
		key: STYLE,
		title: 'Стиль'
	},
	{
		key: OPTIONS,
		title: 'Опции'
	}
];

const REGULAR_TABS = [
	{
		key: PARAMS,
		title: 'Параметры'
	},
	{
		key: STYLE,
		title: 'Стиль'
	}
];

export {
	REGULAR_TABS,
	TAB_TYPES,
	TABS
};
