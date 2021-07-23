// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import WidgetFormPanel from 'components/organisms/WidgetFormPanel';

export default connect(props, functions)(WidgetFormPanel);
