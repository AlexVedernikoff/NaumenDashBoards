// @flow
import 'styles/app.less';
import DashboardContent from 'containers/DashboardContent';
import DashboardHeader from 'containers/DashboardHeader';
import React, {Fragment} from 'react';
import ToastContainer from 'containers/Toast';

export const App = () => (
	<Fragment>
		<ToastContainer />
		<DashboardHeader />
		<DashboardContent />
	</Fragment>
);

export default App;
