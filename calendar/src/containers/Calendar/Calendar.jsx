// @flow
import {functions, props} from './selectors';
import Calendar from 'components/organisms/Calendar';
import {connect} from 'react-redux';

export default connect(props, functions)(Calendar);
