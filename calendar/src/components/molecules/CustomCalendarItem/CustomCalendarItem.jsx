// @flow
import type {ObjectType} from 'utils/types';
import React from 'react';
import {SchedulerItem} from '@progress/kendo-react-scheduler';

const CustomCalendarItem = (props: ObjectType) => (
	<SchedulerItem
		{...props}
		style={{
			...props.style,
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap'
		}}
	/>
);

export default CustomCalendarItem;
