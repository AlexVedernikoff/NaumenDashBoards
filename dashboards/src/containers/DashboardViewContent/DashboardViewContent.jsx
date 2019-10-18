// @flow
import {connect} from 'react-redux';
import DashboardViewContent from 'components/pages/DashboardViewContent';
import {props} from './selectors';

export default connect(props)(DashboardViewContent);
