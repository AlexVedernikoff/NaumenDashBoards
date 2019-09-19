// @flow
import DashboardEditContent from 'containers/DashboardEditContent';
import DashboardEditHeader from 'containers/DashboardEditHeader';
import DashboardWidgetPanel from 'containers/DashboardWidgetPanel';
import DashboardTemplate from 'components/templates/DashboardTemplate';
import React from 'react';

export const DashboardEdit = () => (
	<DashboardTemplate>
		<DashboardEditHeader />
		<DashboardEditContent />
		<DashboardWidgetPanel />
	</DashboardTemplate>
);

export default DashboardEdit;
