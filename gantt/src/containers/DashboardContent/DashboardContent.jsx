// @flow
import {connect} from 'react-redux';
import DashboardContent from 'components/organisms/DashboardContent';
import {props} from './selectors';

export default connect(props)(DashboardContent);
