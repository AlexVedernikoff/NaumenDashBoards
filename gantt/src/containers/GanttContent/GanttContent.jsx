// @flow
import {connect} from 'react-redux';
import GanttContent from 'components/organisms/GanttContent';
import {props} from './selectors';

export default connect(props)(GanttContent);
