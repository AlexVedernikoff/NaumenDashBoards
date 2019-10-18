// @flow
import {connect} from 'react-redux';
import DashboardEditContent from 'components/pages/DashboardEditContent';
import {functions, props} from './selectors';

export default connect(props, functions)(DashboardEditContent);
