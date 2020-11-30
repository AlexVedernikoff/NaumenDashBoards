// @flow
import React, {Fragment, useCallback, useEffect} from 'react';
import {Checkbox} from '@progress/kendo-react-inputs';
import DropdownList from 'components/molecules/DropdownList';
import {LOCATION_TYPES} from 'constants/index';
import type {Props} from 'containers/CalendarSelectors/types';
import styles from './CalendarSelectors.less';

const CalendarSelectors = ({
	calendarList,
	getCalendarList,
	getLocationList,
	isAppSelectorsLoading,
	locationList,
	metaClass,
	selectedOptions: {appointmentsDisabled, calendar, location},
	setSelectedOption,
	subjectId
}: Props) => {
	const isLocationSubject = metaClass && metaClass.includes(LOCATION_TYPES.LOCATION);
	const isCalendarSubject = metaClass && metaClass.includes(LOCATION_TYPES.CALENDAR);
	const isCustomSubject = Boolean(metaClass);

	useEffect(() => {
		if (!isCustomSubject) {
			getLocationList();
		} else {
			if (isLocationSubject) {
				getCalendarList(subjectId);
			}
			if (isCalendarSubject) {
				setSelectedOption('calendar', {
					id: subjectId,
					value: 'calendar'
				});
			}
		}
	}, [getLocationList, isCalendarSubject, isCustomSubject, isLocationSubject]);

	const handleLocationChange = useCallback(
		(event) => {
			const {value} = event;
			setSelectedOption('location', value);
			setSelectedOption('calendar', null);
			getCalendarList(value.id);
		},
		[getCalendarList]
	);

	const handleSetCalendar = useCallback((event) => {
		const {value} = event;
		setSelectedOption('calendar', value);
	}, []);

	const handleSetAppointment = useCallback((event) => {
		const {value} = event;
		setSelectedOption('appointmentsDisabled', value);
	}, []);

	const renderLocationSelector = () => !isLocationSubject && (
		<DropdownList
			data={locationList}
			label="Выберите локацию"
			onChange={handleLocationChange}
			value={location}
		/>
	);

	const renderCalendarSelector = () =>
		<DropdownList
			data={calendarList}
			label="Выберите календарь"
			onChange={handleSetCalendar}
			value={calendar}
		/>;

	const renderAppointmentCheckBox = () =>
		<Checkbox
			className={styles.customCheckboxPosition}
			label="Не отображать записи на прием"
			onChange={handleSetAppointment}
			value={appointmentsDisabled}
		/>;

	if (isAppSelectorsLoading) {
		return null;
	}

	if (isCalendarSubject) {
		return renderAppointmentCheckBox();
	}

	return (
		<Fragment>
			<div className={styles.dropdownContainer}>
				{renderLocationSelector()}
				{renderCalendarSelector()}
				{renderAppointmentCheckBox()}
			</div>
		</Fragment>
	);
};

export default CalendarSelectors;
