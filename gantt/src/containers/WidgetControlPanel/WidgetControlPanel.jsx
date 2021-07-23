// @flow
import {connect} from 'react-redux';
import ControlPanel from 'components/organisms/Widget/components/ControlPanel';
import {functions, props} from './selectors';

export default connect(props, functions)(ControlPanel);
