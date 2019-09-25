// @flow
import type {Props} from './types';
import React, {Fragment} from 'react';
import WidgetAddingPanel from 'containers/WidgetAddPanel';
import WidgetFormPanel from 'containers/WidgetFormPanel';

export const DashboardRightPanel = ({selectedWidget}: Props) => (
	<Fragment>
		{selectedWidget ? <WidgetFormPanel /> : <WidgetAddingPanel />}
	</Fragment>
);

export default DashboardRightPanel;
