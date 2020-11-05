// @flow
import CalendarSelectors from 'components/organisms/CalendarSelectors';
import {connect} from 'react-redux';
import {props} from './selectors';

export default connect(props)(CalendarSelectors);
