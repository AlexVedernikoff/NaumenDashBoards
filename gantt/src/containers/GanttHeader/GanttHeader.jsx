// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import GanttHeader from 'components/organisms/GanttHeader';

export default connect(props, functions)(GanttHeader);
