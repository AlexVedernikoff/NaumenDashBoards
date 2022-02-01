// @flow
import {compose} from 'redux';
import {connect} from 'react-redux';
import DashboardHeader from 'components/organisms/DashboardHeader';
import {functions, props} from './selectors';
import {withCommonDialog} from 'containers/CommonDialogs/withCommonDialog';

export default compose(connect(props, functions), withCommonDialog)(DashboardHeader);
