// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import Widget from 'components/organisms/Widget';

export default connect(props, functions)(Widget);
