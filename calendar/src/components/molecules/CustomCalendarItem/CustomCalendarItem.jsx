// @flow
import React, {useCallback} from 'react';
import type {Props} from './types.js';
import {SchedulerItem} from '@progress/kendo-react-scheduler';

const CustomCalendarItem = ({dataItem, onEventClick, ...restProps}: Props) => {
	const {id} = dataItem;

	const handleEventClick = useCallback(() => onEventClick(id), [id]);

	return (
		<SchedulerItem
			{...restProps}
			style={{border: '1px solid #dee2e6'}}
			onClick={handleEventClick}
		/>
	);
};

export default CustomCalendarItem;
