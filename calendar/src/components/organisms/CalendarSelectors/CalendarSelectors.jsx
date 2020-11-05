// @flow
import type {ComponentType} from 'react';
import DropdownList from 'components/molecules/DropdownList';
import type {Props} from 'containers/CalendarSelectors/types';
import React from 'react';
import styles from './CalendarSelectors.less';

const CalendarSelectors: ComponentType<Props> = (props: Props) => {
	const {calendarList, locationList} = props;
	return (
		<div className={styles.dropdownContainer}>
			<DropdownList label="Выберите локацию" data={locationList} />
			<DropdownList label="Выберите календарь" data={calendarList} />
		</div>
	);
};

export default CalendarSelectors;
