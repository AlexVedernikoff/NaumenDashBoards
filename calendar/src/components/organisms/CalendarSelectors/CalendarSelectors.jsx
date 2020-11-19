// @flow
import React, {useCallback, useEffect, useState} from 'react';
import type {ComponentType} from 'react';
import DropdownList from 'components/molecules/DropdownList';
import {LOCATION_TYPES} from 'constants/index';
import type {Props} from 'containers/CalendarSelectors/types';
import styles from './CalendarSelectors.less';

const CalendarSelectors: ComponentType<Props> = (props: Props) => {
	const {
		initParams: {metaClass, subjectId}
	} = props;
	const isLocationSubject = metaClass && metaClass.includes(LOCATION_TYPES.LOCATION);
	const isCalendarSubject = metaClass && metaClass.includes(LOCATION_TYPES.CALENDAR);
	const isCustomSubject = Boolean(metaClass);

	const [locationValue, setLocationValue] = useState(null);
	const [calendarValue, setCalendarValue] = useState(null);

	const {
		calendarId,
		calendarList,
		getCalendarList,
		getLocationList,
		locationList,
		setCalendar
	} = props;

	useEffect(() => {
		if (!isCustomSubject) {
			getLocationList();
		} else {
			if (isLocationSubject) {
				getCalendarList(subjectId);
			}
			if (isCalendarSubject) {
				setCalendar(subjectId);
			}
		}
	}, [getLocationList, isCalendarSubject, isCustomSubject, isLocationSubject]);

	const handleLocationChange = useCallback(
		(event) => {
			if (calendarId) {
				setCalendar(null);
			}
			const {value} = event;
			setLocationValue(value);
			setCalendarValue(null);
			getCalendarList(value.id);
		},
		[calendarId, getCalendarList]
	);

	const handleSetCalendar = useCallback((event) => {
		const {value} = event;
		setCalendarValue(value);
		setCalendar(value.id);
	}, []);

	if (isCalendarSubject) {
		return null;
	}

	const renderLocationSelector = () => !isLocationSubject && (
		<DropdownList
			data={locationList}
			label="Выберите локацию"
			onChange={handleLocationChange}
			value={locationValue}
		/>
	);

	const renderCalendarSelector = () => <DropdownList
		data={calendarList}
		label="Выберите календарь"
		onChange={handleSetCalendar}
		value={calendarValue}
	/>;

	return (
		<div className={styles.dropdownContainer}>
			{renderLocationSelector()}
			{renderCalendarSelector()}
		</div>
	);
};

export default CalendarSelectors;
