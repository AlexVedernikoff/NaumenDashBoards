// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import Startup from 'components/organisms/Startup';

export default connect(props, functions)(Startup);
