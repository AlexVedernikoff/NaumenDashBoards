// @flow
import 'styles/app.less';
import CommonDialogs from 'containers/CommonDialogs';
import DashboardContent from 'containers/DashboardContent';
import DashboardHeader from 'containers/DashboardHeader';
import React from 'react';
import Startup from 'containers/Startup';
import ToastContainer from 'containers/Toast';

export const App = () => (
	<Startup>
		<ToastContainer />
		<CommonDialogs>
			<DashboardHeader />
			<DashboardContent />
		</CommonDialogs>
	</Startup>
);

export default App;
