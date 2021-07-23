// @flow
import {connect} from 'react-redux';
import DashboardPanel from 'components/organisms/DashboardPanel';
import {functions, props} from './selectors';

export default connect(props, functions)(DashboardPanel);
