// @flow
import {connect} from 'react-redux';
import DashboardContent from 'components/organisms/DashboardContent';
import {functions, props} from './selectors';

export default connect(props, functions)(DashboardContent);
