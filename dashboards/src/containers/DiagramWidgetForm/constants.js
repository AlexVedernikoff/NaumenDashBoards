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

export {
	TAB_TYPES,
	TABS
};
