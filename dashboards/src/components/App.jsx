// @flow
import 'react-grid-layout/css/styles.css';
import DashboardEdit from './pages/DashboardEdit/DashboardEdit';
import DashboardView from './pages/DashboardView/DashboardView';
import React from 'react'
import {Route, Switch} from 'react-router-dom';

export const App = () => (
	<Switch>
		<Route path="/" component={DashboardView} exact />
		<Route path="/edit" component={DashboardEdit} />
	</Switch>
);

export default App;
