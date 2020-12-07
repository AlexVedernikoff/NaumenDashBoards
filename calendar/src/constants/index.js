// @flow
const CALENDAR = 'prCalendar';
const LOCATION = 'prLocation';

export const LOCATION_TYPES = {
	CALENDAR,
	LOCATION
};

export const ALL_CALENDARS_PREFIX = 'all_calendars';

export const CALENDAR_VIEW_TYPES = {
	'{day=День}': 'day',
	'{month=Месяц}': 'month',
	'{week=Неделя}': 'week'
};

export const CALENDAR_STATUS_FILTER = [
	{id: 'closed', value: 'Есть записи на прием'},
	{id: 'registered', value: 'Запись доступна'},
	{id: 'queue', value: 'Прием по живой очереди'},
	{id: 'limited', value: 'Недоступные записи'}
];
