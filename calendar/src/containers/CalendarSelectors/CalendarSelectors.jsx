// @flow
import {functions, props} from './selectors';
import CalendarSelectors from 'components/organisms/CalendarSelectors';
import {connect} from 'react-redux';

export default connect(props, functions)(CalendarSelectors);
