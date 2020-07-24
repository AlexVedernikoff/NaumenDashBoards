// @flow
const MINUTES_FORMATS = [
	{
		label: 'мм (15 мин)',
		value: 'ii'
	}
];

const HOURS_FORMATS = [
	{
		label: 'чч (11)',
		value: 'hh'
	},
	{
		label: 'чч:мм (11:11)',
		value: 'hh:ii'
	}
];

const DAY_FORMATS = [
	{
		label: 'ДД ММ (1 января)',
		value: 'dd MM'
	},
	{
		label: 'ДД.MM.ГГГГ (01.01.2020)',
		value: 'dd.mm.YY'
	},
	{
		label: 'День недели (понедельник)',
		value: 'WD'
	},
	{
		label: 'День месяца (1-й)',
		value: 'dd'
	}
];

const DATETIME_DAY_FORMATS = [
	{
		label: 'ДД ММ (1 января)',
		value: 'dd MM'
	},
	{
		label: 'ДД.ММ.ГГГГ чч:мм (01.01.2020 11:11)',
		value: 'dd.mm.YY hh:ii'
	},
	{
		label: 'ДД.ММ.ГГГГ чч (01.01.2020, 11ч)',
		value: 'dd.mm.YY hh'
	},
	{
		label: 'ДД.MM.ГГГГ (01.01.2020)',
		value: 'dd.mm.YY'
	},
	{
		label: 'День недели (понедельник)',
		value: 'WD'
	},
	{
		label: 'День месяца (1-й)',
		value: 'dd'
	}
];

const WEEK_FORMATS = [
	{
		label: '№ недели (1-я)',
		value: 'ww'
	},
	{
		label: 'Неделя и год (1 неделя 2020)',
		value: 'WW YY'
	}
];

const MONTH_FORMATS = [
	{
		label: 'ММ (январь)',
		value: 'MM'
	},
	{
		label: 'ММ ГГГГ (январь 2020)',
		value: 'MM YY'
	}
];

const SEVEN_DAYS_FORMATS = [
	{
		label: 'ДД ММ - ДД ММ (2 января - 8 января)',
		value: 'dd mm - dd mm'
	}
];

const QUARTER_FORMATS = [
	{
		label: 'Квартал (1 кв-л)',
		value: 'QQ'
	},
	{
		label: 'Квартал и год (1 кв-л 2020)',
		value: 'QQ YY'
	}
];

const YEAR_FORMATS = [
	{
		label: 'ГГГГ (2020)',
		value: 'yyyy'
	}
];

const DATETIME_FORMATS = ['dd.mm.YY hh:ii', 'dd.mm.YY hh', 'dd.mm.YY', 'MM YY', 'yyyy'];

export {
	DATETIME_DAY_FORMATS,
	DATETIME_FORMATS,
	DAY_FORMATS,
	HOURS_FORMATS,
	MINUTES_FORMATS,
	MONTH_FORMATS,
	QUARTER_FORMATS,
	SEVEN_DAYS_FORMATS,
	WEEK_FORMATS,
	YEAR_FORMATS
};
