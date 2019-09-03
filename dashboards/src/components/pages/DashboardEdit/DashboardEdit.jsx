// @flow
import DashboardEditContent from 'containers/DashboardEditContent';
import DashboardEditHeader from 'containers/DashboardEditHeader';
import DashboardTemplate from 'components/templates/DashboardTemplate';
import React from 'react';

export const DashboardEdit = () => (
	<DashboardTemplate>
		<DashboardEditHeader />
		<DashboardEditContent />
	</DashboardTemplate>
);

export default DashboardEdit;
