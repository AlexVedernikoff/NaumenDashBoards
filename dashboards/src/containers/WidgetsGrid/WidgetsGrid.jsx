// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import WidgetsGrid from 'components/organisms/WidgetsGrid';

export default connect(props, functions)(WidgetsGrid);
