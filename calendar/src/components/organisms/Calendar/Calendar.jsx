// @flow
import {
	DayView,
	MonthView,
	Scheduler,
	WeekView
} from '@progress/kendo-react-scheduler';
import React, {useCallback, useEffect, useState} from 'react';
import CustomCalendarItem from 'components/molecules/CustomCalendarItem';
import type {Props} from 'containers/Calendar/types';
import type {SchedulerEvent} from './types';
import {getDates} from 'utils/dateConverter';

const currentDate = new Date();

const Calendar = ({
	calendarData,
	calendarId,
	getCalendarData,
	setCalendarData
}: Props) => {
	const [view, setView] = useState('month');
	const [date, setDate] = useState(currentDate);

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

	return (
		<Scheduler
			data={calendarData}
			date={date}
			item={CustomCalendarItem}
			onDateChange={handleDateChange}
			onViewChange={handleViewChange}
			view={view}
		>
			<DayView />
			<WeekView />
			<MonthView />
		</Scheduler>
	);
};

export default Calendar;
