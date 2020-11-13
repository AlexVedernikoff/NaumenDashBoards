// @flow
import {
	DayView,
	MonthView,
	Scheduler,
	SchedulerFooter,
	WeekView
} from '@progress/kendo-react-scheduler';
import {
	IntlProvider,
	LocalizationProvider,
	load,
	loadMessages
} from '@progress/kendo-react-intl';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import type {Resourse, SchedulerEvent} from './types';
import {getDates, getFormattedDate} from 'utils/dateConverter';
import CustomCalendarHeader from 'components/molecules/CustomCalendarHeader';
import CustomCalendarItem from 'components/molecules/CustomCalendarItem';
import LoadingPanel from 'components/molecules/LoadingPanel';
import {PDFExport} from '@progress/kendo-react-pdf';
import type {Props} from 'containers/Calendar/types';
import caGregorian from 'cldr-dates-full/main/ru/ca-gregorian.json';
import dateFields from 'cldr-dates-full/main/ru/dateFields.json';
import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import numbers from 'cldr-numbers-full/main/ru/numbers.json';
import ruMessages from './ruLocale.json';
import styles from './Calendar.less';
import timeZoneNames from 'cldr-dates-full/main/ru/timeZoneNames.json';
import weekData from 'cldr-core/supplemental/weekData.json';

const currentDate = new Date();
load(caGregorian, dateFields, likelySubtags, numbers, timeZoneNames, weekData);
loadMessages(ruMessages, 'ru-RU');

const Calendar = ({
	calendarData,
	calendarId,
	calendarResourceColorList,
	getCalendarData,
	getCalendarResourceColorList,
	setCalendarData,
	isLoading
}: Props) => {
	const [view, setView] = useState('month');
	const [date, setDate] = useState(currentDate);
	const [dateInterval, setDateInterval] = useState({
		dateFrom: currentDate,
		dateTo: currentDate
	});

	const PDFGeneratorRef = useRef(null);

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

		setDateInterval({
			dateFrom,
			dateTo
		});

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

	const handleGeneratePDF = () => {
		if (PDFGeneratorRef.current) {
			PDFGeneratorRef.current.save();
		}
	};

	const resources: Array<Resourse> = useMemo(
		() => [
			{
				colorField: 'color',
				data: calendarResourceColorList,
				field: 'type',
				name: 'Events',
				valueField: 'value'
			}
		],
		[calendarResourceColorList]
	);

	const PDFFileName = useMemo(
		() =>
			`Расписание на период от ${getFormattedDate(
				dateInterval.dateFrom
			)} по ${getFormattedDate(dateInterval.dateTo)}`,
		[dateInterval]
	);

	return (
		<div className={styles.container}>
			{isLoading && <LoadingPanel />}
			<PDFExport
				ref={PDFGeneratorRef}
				paperSize="auto"
				margin={40}
				fileName={PDFFileName}
				author="Naumen"
			>
				<LocalizationProvider language="ru-RU">
					<IntlProvider locale="ru">
						<Scheduler
							data={calendarData}
							date={date}
							footer={() => <SchedulerFooter />}
							header={(props) => (
								<CustomCalendarHeader
									{...props}
									onExportToPDFClick={handleGeneratePDF}
									isDisabledExport={!calendarId}
								/>
							)}
							item={CustomCalendarItem}
							onDateChange={handleDateChange}
							onViewChange={handleViewChange}
							resources={resources}
							view={view}
						>
							<DayView showWorkHours={false} workDayEnd="00:00" />
							<WeekView showWorkHours={false} workDayEnd="00:00" />
							<MonthView />
						</Scheduler>
					</IntlProvider>
				</LocalizationProvider>
			</PDFExport>
		</div>
	);
};

export default Calendar;
