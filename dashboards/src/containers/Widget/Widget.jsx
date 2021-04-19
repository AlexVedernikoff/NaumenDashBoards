// @flow
import {connect} from 'react-redux';
import {functions} from './selectors';
import Widget from 'components/organisms/Widget';

export default connect(null, functions)(Widget);
