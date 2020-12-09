// @flow
import {
	DayView,
	MonthView,
	Scheduler,
	WeekView,
	WorkWeekView
} from '@progress/kendo-react-scheduler';
import {
	IntlProvider,
	LocalizationProvider,
	load,
	loadMessages
} from '@progress/kendo-react-intl';
import React, {
	Fragment,
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
import CustomCalendarMonthItem from 'components/molecules/CustomCalendarMonthItem';
import CustomDaySlot from 'components/molecules/CustomDaySlot';
import CustomSlot from 'components/molecules/CustomSlot';
import LoadingPanel from 'components/molecules/LoadingPanel';
import {PDFExport} from '@progress/kendo-react-pdf';
import type {Props} from 'containers/Calendar/types';
import ResizeObserver from 'resize-observer-polyfill';
import Resizer from 'utils/Resizer';
import caGregorian from './ca-gregorian.json';
import dateFields from 'cldr-dates-full/main/ru/dateFields.json';
import {getInitView} from 'utils/calendarInit';
import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import numbers from 'cldr-numbers-full/main/ru/numbers.json';
import ruMessages from './ruLocale.json';
import styles from './Calendar.less';
import timeZoneNames from 'cldr-dates-full/main/ru/timeZoneNames.json';
import weekData from 'cldr-core/supplemental/weekData.json';

const currentDate = new Date();
const resizer = new Resizer();

load(caGregorian, dateFields, likelySubtags, numbers, timeZoneNames, weekData);
loadMessages(ruMessages, 'ru-RU');

const Calendar = ({
	calendarData,
	calendarId,
	calendarResourceColorList,
	calendarStatusFilter,
	defaultView,
	getCalendarData,
	hideWeekend,
	isAppLoading,
	isCalendarLoading,
	getCalendarResourceColorList,
	openEventLink,
	setCalendarData
}: Props) => {
	const [view, setView] = useState(getInitView(hideWeekend, '{week=Неделя}'));
	const [date, setDate] = useState(currentDate);
	const [isFull, setIsFull] = useState(false);
	const [calendarHeight, setCalendarHeight] = useState();
	const [dateInterval, setDateInterval] = useState({
		dateFrom: currentDate,
		dateTo: currentDate
	});

	const PDFGeneratorRef = useRef(null);
	const datesRef = useRef({
		dateFrom: null,
		dateTo: null
	});

	useMemo(() => {
		new ResizeObserver(() => {
			const height = resizer.getResizedHeigh();
			setCalendarHeight(height);
		}).observe(window.document.body);
	}, []);

	useEffect(() => {
		const height = resizer.getResizedHeigh();
		setCalendarHeight(height);
	}, [calendarStatusFilter, isAppLoading]);

	useEffect(() => {
		getCalendarResourceColorList();
	}, []);

	useEffect(() => {
		setView(getInitView(hideWeekend, defaultView));
	}, [defaultView, hideWeekend]);

	useEffect(() => {
		if (isFull && PDFGeneratorRef.current) {
			PDFGeneratorRef.current.save();
			setIsFull(false);
		}
	}, [isFull]);

	useEffect(() => {
		if (!calendarId) {
			if (calendarData.length) {
				setCalendarData([]);
			}
			return;
		}

		const [dateFrom, dateTo] = getDates(date, view);
		datesRef.current = {
			dateFrom,
			dateTo
		};

		setDateInterval({
			dateFrom,
			dateTo
		});

		getCalendarData({
			calendarId,
			calendarStatusFilter,
			dateFrom,
			dateTo
		});
	}, [calendarStatusFilter, calendarId, date, view]);

	const handleViewChange = useCallback((event: SchedulerEvent<string>) => {
		setView(event.value);
	}, []);

	const handleDateChange = useCallback((event: SchedulerEvent<Date>) => {
		setDate(event.value);
	}, []);

	const handleGeneratePDF = useCallback(() => {
		if (PDFGeneratorRef.current) {
			setIsFull(true);
		}
	}, []);

	const handleRefresh = useCallback(() => {
		const {dateFrom, dateTo} = datesRef.current;
		getCalendarData({
			calendarId,
			calendarStatusFilter,
			dateFrom,
			dateTo
		});
	}, [calendarStatusFilter, calendarId]);

	const renderSchedulerItem = (props) => (
		<CustomCalendarItem {...props} onEventClick={openEventLink} />
	);

	const renderSchedulerHeader = (props) => (
		<CustomCalendarHeader
			{...props}
			onExportToPDFClick={handleGeneratePDF}
			onRefresh={handleRefresh}
			isDisabledButtons={!calendarId}
		/>
	);

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

	const renderDayView = () => (
		<DayView
			selectedDateFormat="{0:d.MM.y}"
			selectedShortDateFormat="{0:d.MM.y}"
			slot={CustomDaySlot}
			workDayEnd="19:00"
			workDayStart="9:00"
		/>
	);

	const renderWeekView = () =>
		hideWeekend ? (
			<WorkWeekView
				selectedDateFormat="{0:d.MM.y} - {1:d.MM.y}"
				selectedShortDateFormat="{0:d.MM.y} - {1:d.MM.y}"
				slot={CustomSlot}
				workDayEnd="19:00"
				workDayStart="9:00"
			/>
		) : (
			<WeekView
				selectedDateFormat="{0:d.MM.y} - {1:d.MM.y}"
				selectedShortDateFormat="{0:d.MM.y} - {1:d.MM.y}"
				slot={CustomSlot}
				workDayEnd="19:00"
				workDayStart="9:00"
			/>
		);

	const renderMonthView = () => <MonthView item={CustomCalendarMonthItem} slot={CustomSlot} />;

	const renderCalendar = () => (
		<Scheduler
			data={calendarData}
			date={date}
			header={renderSchedulerHeader}
			height={isFull ? '100%' : calendarHeight}
			item={renderSchedulerItem}
			onDateChange={handleDateChange}
			onViewChange={handleViewChange}
			resources={resources}
			view={view}
		>
			{renderDayView()}
			{renderWeekView()}
			{renderMonthView()}
		</Scheduler>
	);

	const renderLocalizedCalendar = () => (
		<LocalizationProvider language="ru-RU">
			<IntlProvider locale="ru">{renderCalendar()}</IntlProvider>
		</LocalizationProvider>
	);

	const renderPDFExportableItem = () => (
		<PDFExport
			ref={PDFGeneratorRef}
			paperSize="auto"
			margin={40}
			fileName={PDFFileName}
			author="Naumen"
		>
			{renderLocalizedCalendar()}
		</PDFExport>
	);

	const renderLoader = () =>
		(isAppLoading || isCalendarLoading) && <LoadingPanel />;

	return (
		<Fragment>
			{renderLoader()}
			<div className={styles.container}>{renderPDFExportableItem()}</div>
		</Fragment>
	);
};

export default Calendar;
