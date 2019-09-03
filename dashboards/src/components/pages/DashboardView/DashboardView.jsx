// @flow
import DashboardTemplate from 'components/templates/DashboardTemplate';
import DashboardViewContent from 'containers/DashboardViewContent';
import DashboardViewHeader from 'components/molecules/DashboardViewHeader';
import React from 'react';

export const DashboardView = () => (
	<DashboardTemplate>
		<DashboardViewHeader />
		<DashboardViewContent />
	</DashboardTemplate>
);

export default DashboardView;
