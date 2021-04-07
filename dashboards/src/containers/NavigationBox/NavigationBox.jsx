// @flow
import {connect} from 'react-redux';
import NavigationBox from 'WidgetFormPanel/components/NavigationBox';
import {props} from './selectors';

export default connect(props)(NavigationBox);
