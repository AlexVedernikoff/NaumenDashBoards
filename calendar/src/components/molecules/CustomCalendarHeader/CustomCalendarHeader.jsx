// @flow
import {Button} from '@progress/kendo-react-buttons';
import type {Props} from './types';
import React from 'react';
import {SchedulerHeader} from '@progress/kendo-react-scheduler';

const CustomCalendarHeader = ({children, isDisabledExport, onExportToPDFClick}: Props) => {
	return (
		<SchedulerHeader>
			{children}
			<Button disabled={isDisabledExport} onClick={onExportToPDFClick}>Экспорт в PDF</Button>
		</SchedulerHeader>
	);
};

export default CustomCalendarHeader;
