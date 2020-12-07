// @flow
import React, {Fragment, useCallback, useEffect} from 'react';
import {CALENDAR_STATUS_FILTER} from '../../../constants';
import DropdownList from 'components/molecules/DropdownList';
import {LOCATION_TYPES} from 'constants/index';
import {MultiSelect} from '@progress/kendo-react-dropdowns';
import type {Props} from 'containers/CalendarSelectors/types';
import styles from './CalendarSelectors.less';

const CalendarSelectors = ({
	calendarList,
	getCalendarList,
	getLocationList,
	isAppSelectorsLoading,
	locationList,
	metaClass,
	selectedOptions: {calendar, calendarStatusFilter, location},
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

	const handleSetStatusFilter = useCallback((event) => {
		const {value} = event;
		setSelectedOption('calendarStatusFilter', value);
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

	const renderStatusFilter = () =>
		<div>
			<p>Фильтр записей</p>
			<MultiSelect
				className={styles.multiselect}
				data={CALENDAR_STATUS_FILTER}
				dataItemKey="id"
				onChange={handleSetStatusFilter}
				placeholder="Все"
				textField="value"
				value={calendarStatusFilter}
			/>
		</div>;

	if (isAppSelectorsLoading) {
		return null;
	}

	if (isCalendarSubject) {
		return renderStatusFilter();
	}

	return (
		<Fragment>
			<div className={styles.dropdownContainer}>
				{renderLocationSelector()}
				{renderCalendarSelector()}
				{renderStatusFilter()}
			</div>
		</Fragment>
	);
};

export default CalendarSelectors;
