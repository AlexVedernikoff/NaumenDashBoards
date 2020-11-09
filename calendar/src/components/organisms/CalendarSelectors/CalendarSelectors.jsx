// @flow
import React, {useCallback, useEffect, useState} from 'react';
import type {ComponentType} from 'react';
import DropdownList from 'components/molecules/DropdownList';
import type {Props} from 'containers/CalendarSelectors/types';
import styles from './CalendarSelectors.less';

const CalendarSelectors: ComponentType<Props> = (props: Props) => {
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
		getLocationList();
	}, [getLocationList]);

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

	return (
		<div className={styles.dropdownContainer}>
			<DropdownList
				data={locationList}
				label="Выберите локацию"
				onChange={handleLocationChange}
				value={locationValue}
			/>
			<DropdownList
				data={calendarList}
				label="Выберите календарь"
				onChange={handleSetCalendar}
				value={calendarValue}
			/>
		</div>
	);
};

export default CalendarSelectors;
