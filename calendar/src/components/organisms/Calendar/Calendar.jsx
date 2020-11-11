// @flow
import {
	DayView,
	MonthView,
	Scheduler,
	WeekView
} from '@progress/kendo-react-scheduler';
import {
	IntlProvider,
	LocalizationProvider,
	load,
	loadMessages
} from '@progress/kendo-react-intl';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import type {Resourse, SchedulerEvent} from './types';
import CustomCalendarItem from 'components/molecules/CustomCalendarItem';
import type {Props} from 'containers/Calendar/types';
import caGregorian from 'cldr-dates-full/main/ru/ca-gregorian.json';
import dateFields from 'cldr-dates-full/main/ru/dateFields.json';
import {getDates} from 'utils/dateConverter';
import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import numbers from 'cldr-numbers-full/main/ru/numbers.json';
import ruMessages from './ruLocale.json';
import timeZoneNames from 'cldr-dates-full/main/ru/timeZoneNames.json';
import weekData from 'cldr-core/supplemental/weekData.json';

const currentDate = new Date();
load(
	caGregorian,
	dateFields,
	likelySubtags,
	numbers,
	timeZoneNames,
	weekData,
);
loadMessages(ruMessages, 'ru-RU');

const Calendar = ({
	calendarData,
	calendarId,
	calendarResourceColorList,
	getCalendarData,
	getCalendarResourceColorList,
	setCalendarData
}: Props) => {
	const [view, setView] = useState('month');
	const [date, setDate] = useState(currentDate);

	useEffect(() => {
		getCalendarResourceColorList();
	}, []);

	useEffect(() => {
		if (!calendarId) {
			if (calendarData.length) {
				setCalendarData([]);
			}
			return;
		}

		const [dateFrom, dateTo] = getDates(date, view);
		getCalendarData({
			calendarId,
			dateFrom,
			dateTo
		});
	}, [calendarId, date, view]);

	const handleViewChange = useCallback((event: SchedulerEvent<string>) => {
		setView(event.value);
	}, []);

	const handleDateChange = useCallback((event: SchedulerEvent<Date>) => {
		setDate(event.value);
	}, []);

	const resources: Array<Resourse> = useMemo(() => [
		{
			colorField: 'color',
			data: calendarResourceColorList,
			field: 'type',
			name: 'Events',
			valueField: 'value'
		}
	], [calendarResourceColorList]);

	return (
		<LocalizationProvider language="ru-RU">
			<IntlProvider locale="ru">
				<Scheduler
					data={calendarData}
					date={date}
					item={CustomCalendarItem}
					onDateChange={handleDateChange}
					onViewChange={handleViewChange}
					resources={resources}
					view={view}
				>
					<DayView />
					<WeekView />
					<MonthView />
				</Scheduler>
			</IntlProvider>
		</LocalizationProvider>
	);
};

export default Calendar;
