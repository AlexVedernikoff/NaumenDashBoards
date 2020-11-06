// @flow
import React, {useCallback, useEffect} from 'react';
import type {ComponentType} from 'react';
import DropdownList from 'components/molecules/DropdownList';
import type {Props} from 'containers/CalendarSelectors/types';
import styles from './CalendarSelectors.less';

const CalendarSelectors: ComponentType<Props> = (props: Props) => {
	const {
		calendarList,
		locationList,
		getCalendarList,
		getLocationList
	} = props;

	useEffect(() => {
		getLocationList();
	}, [getLocationList]);

	const handleLocationChange = useCallback(
		(event) => {
			const {value} = event;
			getCalendarList(value.id);
		},
		[getCalendarList]
	);

	return (
		<div className={styles.dropdownContainer}>
			<DropdownList
				onChange={handleLocationChange}
				label="Выберите локацию"
				data={locationList}
			/>
			<DropdownList label="Выберите календарь" data={calendarList} />
		</div>
	);
};

export default CalendarSelectors;
