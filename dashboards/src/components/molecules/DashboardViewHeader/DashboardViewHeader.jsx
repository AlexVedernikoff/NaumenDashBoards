// @flow
import DashboardHeaderTemplate from 'components/templates/DashboardHeaderTemplate';
import {Link} from 'react-router-dom';
import React from 'react';

export const DashboardViewHeader = () => (
	<DashboardHeaderTemplate>
		<Link to="/edit">Редактировать</Link>
	</DashboardHeaderTemplate>
);

export default DashboardViewHeader;
