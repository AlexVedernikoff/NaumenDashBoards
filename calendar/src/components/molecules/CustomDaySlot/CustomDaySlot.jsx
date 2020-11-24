// @flow
import type {Props} from './types';
import React from 'react';
import {SchedulerSlot} from '@progress/kendo-react-scheduler';
import styles from './CustomDaySlot.less';

const CustomSlot = (props: Props) => (
	<SchedulerSlot
		{...props}
		className={styles.customDaySlot}
	/>
);

export default CustomSlot;
