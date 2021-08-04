// @flow
import {connect} from 'react-redux';
import GanttHeader from 'components/organisms/GanttHeader';
import {functions, props} from './selectors';

export default connect(props, functions)(GanttHeader);
