// @flow
import {connect} from 'react-redux';
import GanttPanel from 'components/organisms/GanttPanel';
import {props} from './selectors';

export default connect(props)(GanttPanel);
