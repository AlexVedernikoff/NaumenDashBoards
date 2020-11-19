// @flow
import type {Props} from './types';
import React from 'react';
import {SchedulerSlot} from '@progress/kendo-react-scheduler';
import styles from './CustomSlot.less';

const date = new Date();

const CustomSlot = (props: Props) => {
	const isCurrentDay = props.start.toDateString() === date.toDateString();

	return 	(
		<SchedulerSlot
			{...props}
			className={isCurrentDay ? styles.currentDay : ''}
		/>
	);
};

export default CustomSlot;
