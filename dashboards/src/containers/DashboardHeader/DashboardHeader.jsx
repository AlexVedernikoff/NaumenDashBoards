// @flow
import {connect} from 'react-redux';
import DashboardHeader from 'components/organisms/DashboardHeader';
import {functions, props} from './selectors';
import {withRouter} from 'react-router-dom';

export default withRouter(
	connect(props, functions)(DashboardHeader)
);
