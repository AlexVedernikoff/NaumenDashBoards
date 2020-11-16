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
			onClick={handleEventClick}
			style={{
				...restProps.style,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap'
			}}
		/>
	);
};

export default CustomCalendarItem;
