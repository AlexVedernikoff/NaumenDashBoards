// @flow
import type {Props} from './types';
import React from 'react';
import {SchedulerSlot} from '@progress/kendo-react-scheduler';
import cn from 'classnames';
import styles from './CustomSlot.less';

const date = new Date();

const CustomSlot = (props: Props) => {
	const isCurrentDay = props.start.toDateString() === date.toDateString();
	const customSlotClasses = cn({
		[styles.currentDay]: isCurrentDay
	});

	return (
		<SchedulerSlot
			{...props}
			className={customSlotClasses}
		/>
	);
};

export default CustomSlot;
