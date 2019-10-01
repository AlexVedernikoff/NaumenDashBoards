// @flow
import type {Props} from './types';
import React from 'react';
import WidgetAddingPanel from 'containers/WidgetAddPanel';
import WidgetFormPanel from 'containers/WidgetFormPanel';

export const DashboardRightPanel = ({selectedWidget}: Props) => (
	selectedWidget ? <WidgetFormPanel /> : <WidgetAddingPanel />
);

export default DashboardRightPanel;
