// @flow
const CUSTOM: 'CUSTOM' = 'CUSTOM';
const SYSTEM: 'SYSTEM' = 'SYSTEM';

const GROUP_TYPES = {
	CUSTOM,
	SYSTEM
};

const TYPE_OPTIONS = [
	{
		label: 'Системная',
		value: SYSTEM
	},
	{
		label: 'Пользовательская',
		value: CUSTOM
	}
];

export {
	GROUP_TYPES,
	TYPE_OPTIONS
};
