// @flow
import React, {useCallback, useEffect} from 'react';
import DropdownList from 'components/molecules/DropdownList';
import {LOCATION_TYPES} from 'constants/index';
import type {Props} from 'containers/CalendarSelectors/types';
import styles from './CalendarSelectors.less';

const CalendarSelectors = ({
	calendarList,
	getCalendarList,
	getLocationList,
	locationList,
	metaClass,
	selectedOptions: {calendar, location},
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

	if (isCalendarSubject) {
		return null;
	}

	const renderLocationSelector = () => !isLocationSubject && (
		<DropdownList
			data={locationList}
			label="Выберите локацию"
			onChange={handleLocationChange}
			value={location}
		/>
	);

	const renderCalendarSelector = () => <DropdownList
		data={calendarList}
		label="Выберите календарь"
		onChange={handleSetCalendar}
		value={calendar}
	/>;

	return (
		<div className={styles.dropdownContainer}>
			{renderLocationSelector()}
			{renderCalendarSelector()}
		</div>
	);
};

export default CalendarSelectors;
