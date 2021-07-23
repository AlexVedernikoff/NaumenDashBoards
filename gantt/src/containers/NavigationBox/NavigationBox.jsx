// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import NavigationBox from 'WidgetFormPanel/components/NavigationBox';

export default connect(props, functions)(NavigationBox);
