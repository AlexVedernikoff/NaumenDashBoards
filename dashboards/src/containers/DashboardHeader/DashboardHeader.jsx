// @flow
import {connect} from 'react-redux';
import DashboardHeader from 'components/organisms/DashboardHeader';
import {functions, props} from './selectors';

export default connect(props, functions)(DashboardHeader);
