// @flow
import {Button} from '@progress/kendo-react-buttons';
import type {Props} from './types';
import React from 'react';
import {SchedulerHeader} from '@progress/kendo-react-scheduler';

const CustomCalendarHeader = ({
	children,
	isDisabledButtons,
	onExportToPDFClick,
	onRefresh: handleRefresh
}: Props) => {
	return (
		<SchedulerHeader>
			{children}
			<Button disabled={isDisabledButtons} onClick={onExportToPDFClick}>
				Экспорт в PDF
			</Button>
			<Button
				disabled={isDisabledButtons}
				iconClass="k-icon k-i-reload"
				onClick={handleRefresh}
				title="Обновить"
			/>
		</SchedulerHeader>
	);
};

export default CustomCalendarHeader;
