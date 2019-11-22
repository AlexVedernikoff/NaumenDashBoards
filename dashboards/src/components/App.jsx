// @flow
import 'styles/app.less';
import DashboardEditContent from 'containers/DashboardEditContent';
import DashboardHeader from 'containers/DashboardHeader';
import DashboardViewContent from 'containers/DashboardViewContent';
import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import ToastContainer from 'containers/Toast';

export const App = () => (
	<Fragment>
		<ToastContainer />
		<DashboardHeader />
		<Switch>
			<Route path="/" component={DashboardViewContent} exact />
			<Route path="/edit" component={DashboardEditContent} />
		</Switch>
	</Fragment>
);

export default App;
